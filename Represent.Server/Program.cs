using System.Security.Claims;
using AspNet.Security.OAuth.Strava;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Represent.Server.Authentication;
using StravaSharp;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Configuration
    .AddUserSecrets<Program>();

builder.Services
    .ConfigureHttpJsonOptions(options => options.SerializerOptions.IncludeFields = true); // for PhotoUrl struct

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    })
    .AddCookie(options =>
    {
        options.LoginPath = "/auth/signin";
        options.LogoutPath = "/auth/signout";
    })
    .AddStrava(options =>
    {
        options.ClientId = builder.Configuration["Strava:ClientId"];
        options.ClientSecret = builder.Configuration["Strava:ClientSecret"];

        options.Scope.Add("activity:read");
        options.Scope.Add("activity:read_all");
        options.Scope.Add("profile:read_all");

        options.SaveTokens = true;
    });

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapPost("/auth/signin", () =>
{
    return Results.Challenge(
        new AuthenticationProperties { RedirectUri = "/" },
        [StravaAuthenticationDefaults.AuthenticationScheme]);
});

app.MapPost("/auth/signout", () =>
{
    return Results.SignOut(
        new AuthenticationProperties { RedirectUri = "/" },
        [CookieAuthenticationDefaults.AuthenticationScheme]);
});

app.MapGet("/api/user", (ClaimsPrincipal user) =>
{
    if (!user.Identity.IsAuthenticated)
    {
        return null;
    }

    return new
    {
        Name = user.FindFirstValue(ClaimTypes.Name)
    };
});

app.MapGet("/api/activities", async (HttpContext context) =>
{
    var token = await context.GetTokenAsync("access_token");
    var client = new Client(new StaticAuthenticator(token));
    // now you can use the Client
    var activities = await client.Activities.GetAthleteActivities(1, 1);
    var latest = activities.FirstOrDefault();

    var details = await client.Activities.Get(latest.Id, false);

    return details;
});


app.MapFallbackToFile("/index.html");

app.UseAuthentication();
//app.UseAuthorization();

app.Run();

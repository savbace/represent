using System.Security.Claims;
using System.Text.Json;
using AspNet.Security.OAuth.Strava;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Represent.Server.Authentication;
using StravaSharp;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    })
    .AddCookie(options =>
    {
        options.LoginPath = "/auth/signin";
        options.LogoutPath = "/auth/signout";

        static bool IsAjaxRequest(HttpRequest request) => string.Equals(request.Query[HeaderNames.XRequestedWith], "XMLHttpRequest", StringComparison.Ordinal)
            || string.Equals(request.Headers.XRequestedWith, "XMLHttpRequest", StringComparison.Ordinal);

        // fix: https://github.com/dotnet/aspnetcore/issues/9039
        options.Events.OnRedirectToLogin += context =>
        {
            if (IsAjaxRequest(context.Request) || context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.Headers.Location = context.RedirectUri;
                context.Response.StatusCode = 401;
            }
            else
            {
                context.Response.Redirect(context.RedirectUri);
            }
            return Task.CompletedTask;
        };
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

builder.Services.AddAuthorization();

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
    return new
    {
        Name = user.FindFirstValue(ClaimTypes.Name)
    };
})
.RequireAuthorization();

var activities = app.MapGroup("/api/activities").RequireAuthorization();

activities.MapGet("/summary", async (HttpContext context) =>
{
    var token = await context.GetTokenAsync("access_token");
    var client = new Client(new StaticAuthenticator(token));
    // now you can use the Client
    var activities = await client.Activities.GetAthleteActivities(1, 10);

    return activities;
});

activities.MapGet("/{id:long}", async (long id, HttpContext context) =>
{
    var token = await context.GetTokenAsync("access_token");
    var client = new Client(new StaticAuthenticator(token));
    var details = await client.Activities.Get(id, false);

    // for PhotoUrl struct
    return Results.Json(details, new JsonSerializerOptions(JsonSerializerDefaults.Web) { IncludeFields = true });
});

app.MapFallbackToFile("/index.html");

app.UseAuthentication();
app.UseAuthorization();

app.Run();

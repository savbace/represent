using System.Security.Claims;
using AspNet.Security.OAuth.Strava;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Configuration
    .AddUserSecrets<Program>();

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

    return user.Claims.Select(claim => new { claim.Type, claim.Value }).ToArray();
});


app.MapFallbackToFile("/index.html");

app.UseAuthentication();
//app.UseAuthorization();

app.Run();

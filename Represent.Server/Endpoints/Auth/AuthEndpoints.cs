using AspNet.Security.OAuth.Strava;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Represent.Server.Endpoints.Auth;

internal static class AuthEndpoints
{
    public static void AddAuthEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var auth = endpoints.MapGroup("/auth");

        auth.MapPost("/signin", () =>
        {
            return Results.Challenge(
                new AuthenticationProperties { RedirectUri = "/" },
                [StravaAuthenticationDefaults.AuthenticationScheme]);
        });

        auth.MapPost("/signout", () =>
        {
            return Results.SignOut(
                new AuthenticationProperties { RedirectUri = "/" },
                [CookieAuthenticationDefaults.AuthenticationScheme]);
        });
    }
}

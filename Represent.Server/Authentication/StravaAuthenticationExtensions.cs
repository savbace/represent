using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Net.Http.Headers;

namespace Represent.Server.Authentication;

internal static class StravaAuthenticationExtensions
{
    public static IServiceCollection AddStravaAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddCookie(options =>
            {
                options.LoginPath = "/auth/signin";
                options.LogoutPath = "/auth/signout";

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
                options.ClientId = configuration["Strava:ClientId"];
                options.ClientSecret = configuration["Strava:ClientSecret"];

                options.Scope.Add("activity:read");
                options.Scope.Add("activity:read_all");
                options.Scope.Add("profile:read_all");

                options.SaveTokens = true;
            });

        return services;
    }

    private static bool IsAjaxRequest(HttpRequest request) =>
        string.Equals(request.Query[HeaderNames.XRequestedWith], "XMLHttpRequest", StringComparison.Ordinal)
            || string.Equals(request.Headers.XRequestedWith, "XMLHttpRequest", StringComparison.Ordinal);
}

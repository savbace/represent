using System.Security.Claims;

namespace Represent.Server.Endpoints.User;

internal static class UserEndpoints
{
    public static void AddUserEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints
            .MapGet("/api/user", (ClaimsPrincipal user) =>
            {
                return new
                {
                    Name = user.FindFirstValue(ClaimTypes.Name)
                };
            })
            .RequireAuthorization();
    }
}

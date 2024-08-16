using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Represent.Server.Authentication;
using StravaSharp;

namespace Represent.Server.Endpoints.Activities;

internal static class ActivitiesEndpoints
{
    public static void AddActivitiesEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var activities = endpoints.MapGroup("/api/activities").RequireAuthorization();

        activities.MapGet("/summary", async (HttpContext context) =>
        {
            var token = await context.GetTokenAsync("access_token");
            var client = new Client(new StaticAuthenticator(token));

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
    }
}

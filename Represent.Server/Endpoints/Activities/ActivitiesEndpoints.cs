using System.Net.Mime;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
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

            var athleteActivities = await client.Activities.GetAthleteActivities(1, 10);

            return athleteActivities.Select(activity => new ActivityResource
            {
                Id = activity.Id,
                Name = activity.Name,
                Distance = activity.Distance,
                MovingTime = activity.MovingTime,
                StartDate = activity.StartDate,
                TotalElevationGain = activity.TotalElevationGain,
                MapPolyline = activity.Map.SummaryPolyline,
                PhotoCount = activity.TotalPhotoCount
            });
        });

        activities.MapGet("/{id:long}", async (long id, HttpContext context) =>
        {
            var activity = await GetActivity(id, context);

            var resource = new ActivityResource
            {
                Id = activity.Id,
                Name = activity.Name,
                Distance = activity.Distance,
                MovingTime = activity.MovingTime,
                StartDate = activity.StartDate,
                TotalElevationGain = activity.TotalElevationGain,
                MapPolyline = activity.Map.SummaryPolyline,
                PhotoCount = activity.Photos.Count
            };

            return resource;
        });

        activities.MapGet("/{id:long}/photo", async (long id, HttpContext context, [FromServices] HttpClient httpClient) =>
        {
            // todo: use internal /api/activity/:id/photos API
            var activity = await GetActivity(id, context);

            if (activity.Photos.Count == 0)
            {
                return Results.NotFound();
            }

            var url = activity.Photos.Primary.Urls.Medium;

            var stream = await httpClient.GetStreamAsync(url);

            context.Response.Headers.CacheControl = $"public,max-age={TimeSpan.FromHours(24).TotalSeconds}";
            return Results.Stream(stream, MediaTypeNames.Image.Jpeg);
        });
    }

    private static async Task<Activity> GetActivity(long id, HttpContext context)
    {
        var token = await context.GetTokenAsync("access_token");
        var client = new Client(new StaticAuthenticator(token));

        var activity = await client.Activities.Get(id, false);
        return activity;
    }
}

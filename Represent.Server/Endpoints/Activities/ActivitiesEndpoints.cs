using System.Net.Mime;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Represent.Server.Strava;
using StravaSharp;

namespace Represent.Server.Endpoints.Activities;

internal static class ActivitiesEndpoints
{
    public static void AddActivitiesEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var activities = endpoints.MapGroup("/api/activities").RequireAuthorization();

        activities.MapGet("/summary", async (HttpContext context) =>
        {
            var client = await CreateClient(context);
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
            var client = await CreateClient(context);
            var activity = await client.Activities.Get(id, false);

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

        activities.MapGet("/{id:long}/photo-proxy", async (long id, [FromQuery] string? photoId, HttpContext context, [FromServices] HttpClient httpClient) =>
        {
            const int size = 700;
            var client = await CreateClient(context);
            var photos = await client.GetActivityPhotos(id, size);

            var photo = !string.IsNullOrWhiteSpace(photoId)
                ? photos.FirstOrDefault(x => x.UniqueId == photoId)
                : photos.FirstOrDefault(x => x.DefaultPhoto) ?? photos.FirstOrDefault();

            if (photo == null)
            {
                return Results.NotFound();
            }

            var url = photo.Urls[size.ToString()];

            var stream = await httpClient.GetStreamAsync(url);

            context.Response.Headers.CacheControl = $"public,max-age={TimeSpan.FromHours(24).TotalSeconds}";
            return Results.Stream(stream, MediaTypeNames.Image.Jpeg);
        });

        activities.MapGet("/{id:long}/photos", async (long id, HttpContext context, [FromServices] HttpClient httpClient) =>
        {
            const int size = 100;
            var client = await CreateClient(context);
            var photos = await client.GetActivityPhotos(id, size);

            var resources = photos.Select(x => new PhotoResource { Url = x.Urls[size.ToString()], Id = x.UniqueId });

            return resources;
        });
    }

    private static async Task<Client> CreateClient(HttpContext context)
    {
        var token = await context.GetTokenAsync("access_token");

        return new Client(new StaticAuthenticator(token));
    }
}

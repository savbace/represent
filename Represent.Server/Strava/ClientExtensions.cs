using System.Text.Json;
using RestSharp;
using StravaSharp;

namespace Represent.Server.Strava;

internal static class ClientExtensions
{
    // The endpoint is not documented in Strava docs.
    public static async Task<ActivityPhoto[]> GetActivityPhotos(this Client client, long activityId, int size = 1800)
    {
        var restClient = GetRestClient(client);
        var response = await restClient.ExecuteGetAsync(new RestRequest($"/api/v3/activities/{activityId}/photos?size={size}"));
        response.ThrowIfError();

        return JsonSerializer.Deserialize<ActivityPhoto[]>(response.Content);
    }

    private static RestClient GetRestClient(Client client)
    {
        var field = typeof(Client).GetField("_restClient", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic);
        var restClient = (RestClient)field.GetValue(client);

        return restClient;
    }
}

using System.Text.Json.Serialization;

namespace Represent.Server.Strava;

public class ActivityPhoto
{
    [JsonPropertyName("unique_id")]
    public string UniqueId { get; set; }

    [JsonPropertyName("athlete_id")]
    public int AthleteId { get; set; }

    [JsonPropertyName("activity_id")]
    public long ActivityId { get; set; }

    [JsonPropertyName("activity_name")]
    public string ActivityName { get; set; }

    [JsonPropertyName("post_id")]
    public string PostId { get; set; }

    [JsonPropertyName("resource_state")]
    public int ResourceState { get; set; }

    [JsonPropertyName("caption")]
    public string Caption { get; set; }

    [JsonPropertyName("type")]
    public int Type { get; set; }

    [JsonPropertyName("source")]
    public int Source { get; set; }

    [JsonPropertyName("status")]
    public int Status { get; set; }

    [JsonPropertyName("uploaded_at")]
    public DateTime UploadedAt { get; set; }

    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("created_at_local")]
    public DateTime CreatedAtLocal { get; set; }

    [JsonPropertyName("urls")]
    public Dictionary<string, string> Urls { get; set; }

    [JsonPropertyName("placeholder_image")]
    public object PlaceholderImage { get; set; }

    [JsonPropertyName("sizes")]
    public Dictionary<string, int[]> Sizes { get; set; }

    [JsonPropertyName("default_photo")]
    public bool DefaultPhoto { get; set; }
}


namespace Represent.Server.Endpoints.Activities;

internal class ActivityResource
{
    public long Id { get; set; }
    public string Name { get; set; }
    public float Distance { get; set; }
    public int MovingTime { get; set; }
    public DateTime StartDate { get; set; }
    public float TotalElevationGain { get; set; }
    public string MapPolyline { get; set; }
    public int PhotoCount { get; set; }
}
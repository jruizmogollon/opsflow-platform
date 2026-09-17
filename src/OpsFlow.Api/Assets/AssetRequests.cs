namespace OpsFlow.Api.Assets;

public sealed record CreateAssetRequest(
    string Name,
    string SerialNumber,
    string Location,
    string Status = "Available");

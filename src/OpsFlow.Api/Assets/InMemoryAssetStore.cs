using System.Collections.Concurrent;
using OpsFlow.Api.Tickets;

namespace OpsFlow.Api.Assets;

public sealed class InMemoryAssetStore : IAssetStore
{
    private readonly ConcurrentDictionary<Guid, Asset> assets = new();

    public IReadOnlyCollection<Asset> GetAll() => assets.Values.OrderBy(asset => asset.Name).ToArray();

    public Asset? Get(Guid id) => assets.TryGetValue(id, out var asset) ? asset : null;

    public Asset Add(string name, string serialNumber, string location, string status)
    {
        var asset = new Asset(Guid.NewGuid(), name, serialNumber, location, status);
        assets[asset.Id] = asset;
        return asset;
    }
}

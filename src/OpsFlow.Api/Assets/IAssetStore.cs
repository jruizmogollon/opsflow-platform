using OpsFlow.Api.Tickets;

namespace OpsFlow.Api.Assets;

public interface IAssetStore
{
    IReadOnlyCollection<Asset> GetAll();
    Asset? Get(Guid id);
    Asset Add(string name, string serialNumber, string location, string status);
}

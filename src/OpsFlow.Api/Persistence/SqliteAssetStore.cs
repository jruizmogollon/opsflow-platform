using Microsoft.EntityFrameworkCore;
using OpsFlow.Api.Assets;
using OpsFlow.Api.Tickets;

namespace OpsFlow.Api.Persistence;

public sealed class SqliteAssetStore(OpsFlowDbContext db) : IAssetStore
{
    public IReadOnlyCollection<Asset> GetAll() => db.Assets.AsNoTracking().OrderBy(asset => asset.Name).AsEnumerable().Select(ToDomain).ToArray();

    public Asset? Get(Guid id) => db.Assets.AsNoTracking().SingleOrDefault(asset => asset.Id == id) is { } asset ? ToDomain(asset) : null;

    public Asset Add(string name, string serialNumber, string location, string status)
    {
        var entity = new AssetEntity { Id = Guid.NewGuid(), Name = name, SerialNumber = serialNumber, Location = location, Status = status };
        db.Assets.Add(entity);
        db.SaveChanges();
        return ToDomain(entity);
    }

    private static Asset ToDomain(AssetEntity entity) => new(entity.Id, entity.Name, entity.SerialNumber, entity.Location, entity.Status);
}

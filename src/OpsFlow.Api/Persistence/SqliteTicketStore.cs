using Microsoft.EntityFrameworkCore;
using OpsFlow.Api.Tickets;

namespace OpsFlow.Api.Persistence;

public sealed class SqliteTicketStore(OpsFlowDbContext db) : ITicketStore
{
    public IReadOnlyCollection<Ticket> GetAll(TicketStatus? status = null)
    {
        var query = db.Tickets.AsNoTracking();
        if (status is not null) query = query.Where(ticket => ticket.Status == status);

        return query.ToArray().OrderByDescending(ticket => ticket.CreatedAt).Select(ToDomain).ToArray();
    }

    public Ticket? Get(Guid id) => db.Tickets.AsNoTracking().SingleOrDefault(ticket => ticket.Id == id) is { } ticket ? ToDomain(ticket) : null;

    public Ticket Add(string title, string description, TicketPriority priority, Guid? assetId = null, string? assignee = null)
    {
        var now = DateTimeOffset.UtcNow;
        var entity = new TicketEntity
        {
            Id = Guid.NewGuid(),
            Title = title,
            Description = description,
            Priority = priority,
            Status = TicketStatus.Open,
            CreatedAt = now,
            UpdatedAt = now,
            AssetId = assetId,
            Assignee = assignee
        };
        db.Tickets.Add(entity);
        db.SaveChanges();
        return ToDomain(entity);
    }

    public Ticket? ChangeStatus(Guid id, TicketStatus status)
    {
        var entity = db.Tickets.SingleOrDefault(ticket => ticket.Id == id);
        if (entity is null) return null;
        entity.Status = status;
        entity.UpdatedAt = DateTimeOffset.UtcNow;
        db.SaveChanges();
        return ToDomain(entity);
    }

    public Ticket? ChangeAssignment(Guid id, Guid? assetId, string? assignee)
    {
        var entity = db.Tickets.SingleOrDefault(ticket => ticket.Id == id);
        if (entity is null) return null;
        entity.AssetId = assetId;
        entity.Assignee = assignee;
        entity.UpdatedAt = DateTimeOffset.UtcNow;
        db.SaveChanges();
        return ToDomain(entity);
    }

    private static Ticket ToDomain(TicketEntity entity) => new(entity.Id, entity.Title, entity.Description, entity.Priority, entity.Status, entity.CreatedAt, entity.UpdatedAt, entity.AssetId, entity.Assignee);
}

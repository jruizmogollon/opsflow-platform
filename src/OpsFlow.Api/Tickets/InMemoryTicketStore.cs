using System.Collections.Concurrent;

namespace OpsFlow.Api.Tickets;

public sealed class InMemoryTicketStore : ITicketStore
{
    private readonly ConcurrentDictionary<Guid, Ticket> tickets = new();

    public IReadOnlyCollection<Ticket> GetAll(TicketStatus? status = null)
    {
        return tickets.Values
            .Where(ticket => status is null || ticket.Status == status)
            .OrderByDescending(ticket => ticket.CreatedAt)
            .ToArray();
    }

    public Ticket? Get(Guid id) => tickets.TryGetValue(id, out var ticket) ? ticket : null;

    public Ticket Add(string title, string description, TicketPriority priority, Guid? assetId = null, string? assignee = null)
    {
        var now = DateTimeOffset.UtcNow;
        var ticket = new Ticket(Guid.NewGuid(), title, description, priority, TicketStatus.Open, now, now, assetId, assignee);
        tickets[ticket.Id] = ticket;
        return ticket;
    }

    public Ticket? ChangeStatus(Guid id, TicketStatus status)
    {
        while (tickets.TryGetValue(id, out var current))
        {
            var updated = current with { Status = status, UpdatedAt = DateTimeOffset.UtcNow };
            if (tickets.TryUpdate(id, updated, current))
            {
                return updated;
            }
        }

        return null;
    }

    public Ticket? ChangeAssignment(Guid id, Guid? assetId, string? assignee)
    {
        while (tickets.TryGetValue(id, out var current))
        {
            var updated = current with { AssetId = assetId, Assignee = assignee, UpdatedAt = DateTimeOffset.UtcNow };
            if (tickets.TryUpdate(id, updated, current))
            {
                return updated;
            }
        }

        return null;
    }
}

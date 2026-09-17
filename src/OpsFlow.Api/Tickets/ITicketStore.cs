namespace OpsFlow.Api.Tickets;

public interface ITicketStore
{
    IReadOnlyCollection<Ticket> GetAll(TicketStatus? status = null);
    Ticket? Get(Guid id);
    Ticket Add(string title, string description, TicketPriority priority, Guid? assetId = null, string? assignee = null);
    Ticket? ChangeStatus(Guid id, TicketStatus status);
    Ticket? ChangeAssignment(Guid id, Guid? assetId, string? assignee);
}

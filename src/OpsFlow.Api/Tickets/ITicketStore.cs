namespace OpsFlow.Api.Tickets;

public interface ITicketStore
{
    IReadOnlyCollection<Ticket> GetAll(TicketStatus? status = null);
    Ticket? Get(Guid id);
    Ticket Add(string title, string description, TicketPriority priority);
    Ticket? ChangeStatus(Guid id, TicketStatus status);
}

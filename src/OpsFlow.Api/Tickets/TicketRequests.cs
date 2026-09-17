namespace OpsFlow.Api.Tickets;

public sealed record CreateTicketRequest(
    string Title,
    string Description,
    TicketPriority Priority = TicketPriority.Medium);

public sealed record ChangeTicketStatusRequest(TicketStatus Status);

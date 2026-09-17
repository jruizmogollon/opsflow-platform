namespace OpsFlow.Api.Tickets;

public sealed record CreateTicketRequest(
    string Title,
    string Description,
    TicketPriority Priority = TicketPriority.Medium,
    Guid? AssetId = null,
    string? Assignee = null);

public sealed record ChangeTicketStatusRequest(TicketStatus Status);

public sealed record ChangeTicketAssignmentRequest(Guid? AssetId, string? Assignee);

namespace OpsFlow.Api.Tickets;

public enum TicketStatus
{
    Open,
    InProgress,
    Resolved,
    Closed
}

public enum TicketPriority
{
    Low,
    Medium,
    High,
    Critical
}

public sealed record Asset(
    Guid Id,
    string Name,
    string SerialNumber,
    string Location,
    string Status);

public sealed record Ticket(
    Guid Id,
    string Title,
    string Description,
    TicketPriority Priority,
    TicketStatus Status,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    Guid? AssetId = null,
    string? Assignee = null);

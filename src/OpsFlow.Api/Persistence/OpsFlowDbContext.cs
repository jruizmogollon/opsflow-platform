using Microsoft.EntityFrameworkCore;
using OpsFlow.Api.Tickets;

namespace OpsFlow.Api.Persistence;

public sealed class OpsFlowDbContext(DbContextOptions<OpsFlowDbContext> options) : DbContext(options)
{
    public DbSet<TicketEntity> Tickets => Set<TicketEntity>();
    public DbSet<AssetEntity> Assets => Set<AssetEntity>();
}

public sealed class TicketEntity
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public TicketPriority Priority { get; set; }
    public TicketStatus Status { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public Guid? AssetId { get; set; }
    public string? Assignee { get; set; }
}

public sealed class AssetEntity
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string SerialNumber { get; set; }
    public required string Location { get; set; }
    public required string Status { get; set; }
}

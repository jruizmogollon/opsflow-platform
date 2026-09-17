using OpsFlow.Api.Tickets;
using Microsoft.EntityFrameworkCore;
using OpsFlow.Api.Persistence;

namespace OpsFlow.Api.Tests;

public sealed class InMemoryTicketStoreTests
{
    [Fact]
    public void Add_creates_an_open_ticket()
    {
        var store = new InMemoryTicketStore();

        var ticket = store.Add("Laptop no enciende", "El equipo no inicia", TicketPriority.High);

        Assert.NotEqual(Guid.Empty, ticket.Id);
        Assert.Equal(TicketStatus.Open, ticket.Status);
        Assert.Equal(TicketPriority.High, ticket.Priority);
    }

    [Fact]
    public void ChangeStatus_updates_the_ticket_and_filter_returns_it()
    {
        var store = new InMemoryTicketStore();
        var ticket = store.Add("Sin acceso", "El usuario no puede iniciar sesión", TicketPriority.Medium);

        var updated = store.ChangeStatus(ticket.Id, TicketStatus.InProgress);
        var filtered = store.GetAll(TicketStatus.InProgress);

        Assert.NotNull(updated);
        Assert.Equal(TicketStatus.InProgress, updated!.Status);
        Assert.Single(filtered);
        Assert.Equal(ticket.Id, filtered.Single().Id);
    }

    [Fact]
    public void ChangeStatus_returns_null_for_an_unknown_ticket()
    {
        var store = new InMemoryTicketStore();

        var updated = store.ChangeStatus(Guid.NewGuid(), TicketStatus.Closed);

        Assert.Null(updated);
    }

    [Fact]
    public void Sqlite_store_keeps_a_ticket_after_context_is_recreated()
    {
        var databasePath = Path.Combine(Path.GetTempPath(), $"opsflow-{Guid.NewGuid():N}.db");
        var options = new DbContextOptionsBuilder<OpsFlowDbContext>()
            .UseSqlite($"Data Source={databasePath};Pooling=False")
            .Options;

        try
        {
            Guid ticketId;
            using (var firstContext = new OpsFlowDbContext(options))
            {
                firstContext.Database.EnsureCreated();
                ticketId = new SqliteTicketStore(firstContext)
                    .Add("Persisted ticket", "Stored in SQLite", TicketPriority.Low).Id;
            }

            using (var secondContext = new OpsFlowDbContext(options))
            {
                var persisted = new SqliteTicketStore(secondContext).Get(ticketId);

                Assert.NotNull(persisted);
                Assert.Equal("Persisted ticket", persisted!.Title);
            }
        }
        finally
        {
            File.Delete(databasePath);
            File.Delete($"{databasePath}-shm");
            File.Delete($"{databasePath}-wal");
        }
    }
}

using OpsFlow.Api.Tickets;

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
}

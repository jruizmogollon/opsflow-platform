using Microsoft.AspNetCore.Mvc;
using OpsFlow.Api.Tickets;

namespace OpsFlow.Api.Controllers;

[ApiController]
[Route("api/tickets")]
public sealed class TicketsController(ITicketStore ticketStore) : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyCollection<Ticket>> GetAll([FromQuery] TicketStatus? status = null)
    {
        return Ok(ticketStore.GetAll(status));
    }

    [HttpGet("{id:guid}")]
    public ActionResult<Ticket> Get(Guid id)
    {
        var ticket = ticketStore.Get(id);
        return ticket is null ? NotFound() : Ok(ticket);
    }

    [HttpPost]
    public ActionResult<Ticket> Create(CreateTicketRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest(new { error = "Title is required." });
        }

        if (string.IsNullOrWhiteSpace(request.Description))
        {
            return BadRequest(new { error = "Description is required." });
        }

        var ticket = ticketStore.Add(request.Title.Trim(), request.Description.Trim(), request.Priority);
        return CreatedAtAction(nameof(Get), new { id = ticket.Id }, ticket);
    }

    [HttpPatch("{id:guid}/status")]
    public ActionResult<Ticket> ChangeStatus(Guid id, ChangeTicketStatusRequest request)
    {
        var ticket = ticketStore.ChangeStatus(id, request.Status);
        return ticket is null ? NotFound() : Ok(ticket);
    }
}

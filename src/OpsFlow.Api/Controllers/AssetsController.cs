using Microsoft.AspNetCore.Mvc;
using OpsFlow.Api.Assets;
using OpsFlow.Api.Tickets;

namespace OpsFlow.Api.Controllers;

[ApiController]
[Route("api/assets")]
public sealed class AssetsController(IAssetStore assetStore) : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyCollection<Asset>> GetAll() => Ok(assetStore.GetAll());

    [HttpPost]
    public ActionResult<Asset> Create(CreateAssetRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.SerialNumber))
        {
            return BadRequest(new { error = "Name and serial number are required." });
        }

        var asset = assetStore.Add(request.Name.Trim(), request.SerialNumber.Trim(), request.Location.Trim(), request.Status.Trim());
        return Created($"/api/assets/{asset.Id}", asset);
    }
}

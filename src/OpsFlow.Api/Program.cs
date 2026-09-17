using OpsFlow.Api.Tickets;
using Microsoft.EntityFrameworkCore;
using OpsFlow.Api.Assets;
using OpsFlow.Api.Persistence;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://127.0.0.1:5173", "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()));
builder.Services.AddOpenApi();
var databasePath = Path.Combine(builder.Environment.ContentRootPath, "opsflow.db");
builder.Services.AddDbContext<OpsFlowDbContext>(options => options.UseSqlite($"Data Source={databasePath}"));
builder.Services.AddScoped<ITicketStore, SqliteTicketStore>();
builder.Services.AddScoped<IAssetStore, SqliteAssetStore>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<OpsFlowDbContext>();
    db.Database.EnsureCreated();
    var assets = scope.ServiceProvider.GetRequiredService<IAssetStore>();
    if (!assets.GetAll().Any())
    {
        assets.Add("Laptop de soporte", "OPS-LT-001", "Oficina principal", "Available");
        assets.Add("Impresora de recepción", "OPS-PR-001", "Recepción", "Available");
        assets.Add("Router de red", "OPS-NW-001", "Sala técnica", "Maintenance");
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/health", () => Results.Ok(new
{
    service = "opsflow-api",
    status = "ok",
    timestamp = DateTimeOffset.UtcNow
}));

app.UseCors();
app.MapControllers();

app.Run();

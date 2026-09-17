# OpsFlow Platform

> Work in progress

OpsFlow is a small service-management platform for organizations that need to control support tickets, equipment and response times in one place.

The project is being built as a portfolio piece to practice complete software design: requirements, architecture, API design, security, testing and documentation.

## Planned modules

- Authentication and role-based access.
- Ticket creation, assignment and status tracking.
- Equipment and asset inventory.
- SLA and response-time tracking.
- Audit history for important changes.
- Dashboard for supervisors.
- Flutter app for technicians.

## Planned architecture

The first version will use a modular backend with clear boundaries instead of starting with unnecessary microservices.

- **Mobile:** Flutter and Dart.
- **Web dashboard:** React and TypeScript.
- **API:** ASP.NET Core and C#.
- **Data:** PostgreSQL or Supabase.
- **Documentation:** OpenAPI, C4 diagrams and architecture decision records.

## Current status

- [x] Define the first release scope.
- [x] Document the initial domain and architecture.
- [x] Create the ASP.NET Core API skeleton.
- [x] Add a ticket workflow with in-memory storage for the first MVP.
- [x] Add health check and OpenAPI support.
- [x] Add automated tests for ticket creation and status changes.
- [ ] Replace temporary storage with a database.
- [ ] Add authentication and roles.
- [ ] Connect the Flutter app.
- [ ] Publish a safe demo without real credentials.

## Run the API

```bash
dotnet run --project src/OpsFlow.Api/OpsFlow.Api.csproj
```

Useful endpoints:

- `GET /health`
- `GET /api/tickets`
- `POST /api/tickets`
- `PATCH /api/tickets/{id}/status`

Run the tests with:

```bash
dotnet test OpsFlow.slnx
```

## Repository rules

No real user information, passwords, tokens, private keys or production credentials will be committed to this repository.

# OpsFlow Platform

OpsFlow is a service operations platform for small teams that need to manage incidents, equipment and response times in one place.

This is a portfolio project focused on practical software architecture: a clear domain, a modular backend, a working web dashboard and automated tests. The first release is intentionally small so the design can evolve from a real use case instead of starting with unnecessary microservices.

## What works today

- Create and list support tickets.
- Validate ticket title and description.
- Track priority and status (`Open`, `InProgress`, `Resolved`, `Closed`).
- Associate a ticket with an operational asset and technician.
- Keep data after restarting the API with SQLite persistence.
- Filter tickets by status through the API.
- Update a ticket status from the dashboard.
- Health endpoint and OpenAPI document.
- Unit tests for the core ticket workflow.

## Technology

- **Backend:** ASP.NET Core, C# and .NET 9.
- **Dashboard:** React, Vite and responsive CSS.
- **Mobile:** Flutter and Dart technician client.
- **Persistence:** SQLite for the local MVP, with PostgreSQL planned for deployment.
- **Testing:** xUnit.

## Architecture

The first release is a modular monolith. It keeps deployment and debugging simple while keeping domain boundaries explicit. The main modules are Identity, Tickets, Assets, SLA, Notifications and Audit.

See the [architecture notes](docs/architecture.md) and [roadmap](docs/roadmap.md) for the reasoning behind the design.

## Run the dashboard locally

Start the API and dashboard in separate terminals:

```bash
dotnet run --project src/OpsFlow.Api/OpsFlow.Api.csproj --urls http://127.0.0.1:5188
cd src/OpsFlow.Dashboard
npm install
npm run dev
```

Then open `http://127.0.0.1:5173/` in a browser.

## Current status

## Delivery plan

- [x] Define the first release scope.
- [x] Document the initial domain and architecture.
- [x] Create the ASP.NET Core API skeleton.
- [x] Add the ticket workflow and dashboard.
- [x] Add asset association, assignment and SQLite persistence.
- [x] Add the first Flutter technician client.
- [x] Add automated tests and a CI workflow.
- [ ] Replace temporary storage with PostgreSQL.
- [ ] Add authentication and roles.
- [ ] Deploy a safe public demo with sample data.

## Run the API

```bash
dotnet run --project src/OpsFlow.Api/OpsFlow.Api.csproj
```

Useful endpoints:

- `GET /health`
- `GET /api/tickets`
- `POST /api/tickets`
- `PATCH /api/tickets/{id}/status`
- `PATCH /api/tickets/{id}/assignment`
- `GET /api/assets`

## Run the Flutter client

The mobile client uses `10.0.2.2` when running on an Android emulator, which maps to the host machine. For a physical device, replace `baseUrl` in `src/OpsFlow.Mobile/lib/services/opsflow_api.dart` with the computer's local network address.

```bash
cd src/OpsFlow.Mobile
flutter pub get
flutter run
```

Run the tests with:

```bash
dotnet test OpsFlow.slnx
```

## Engineering principles

- Prefer a modular monolith until there is a real reason to split services.
- Keep business rules testable without the web layer.
- Make important changes auditable.
- Never commit credentials or real user information.

## Repository rules

No real user information, passwords, tokens, private keys or production credentials will be committed to this repository.

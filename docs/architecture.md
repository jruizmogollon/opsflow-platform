# OpsFlow architecture notes

## First decision

The first release will be a modular monolith. This keeps deployment and debugging simple while the domain boundaries remain explicit. If a module later needs to scale or deploy independently, it can be extracted with less risk.

## Main modules

- **Identity:** users, roles and organization membership.
- **Tickets:** incidents, priorities, status and assignment.
- **Assets:** equipment, location and responsible person.
- **SLA:** response and resolution targets.
- **Notifications:** in-app and email notification events.
- **Audit:** trace of important actions.

## First user roles

- **Administrator:** manages the organization and users.
- **Supervisor:** creates, assigns and monitors tickets.
- **Technician:** works on assigned tickets and updates their progress.

## First flow

1. A user creates a ticket and selects the affected asset.
2. A supervisor assigns the ticket to a technician.
3. The technician changes the status and records the work performed.
4. The system calculates response and resolution times.
5. The supervisor closes the ticket and reviews the history.

## Quality goals

- The API must validate permissions on every protected action.
- Important changes must be auditable.
- The mobile app should show a useful error when the network is unavailable.
- Tests should cover the ticket workflow and permission rules.
- The demo must run with sample data and environment variables, never real credentials.

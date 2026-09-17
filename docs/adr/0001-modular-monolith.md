# ADR 0001: Start with a modular monolith

## Status

Accepted

## Context

OpsFlow needs a backend for tickets, assets, users and service-level rules. At the beginning, the team and the domain are small. Several independent deployments would add operational cost before there is a real scaling problem.

## Decision

Start with one deployable ASP.NET Core application and keep the domain areas separated in code. Each module should expose clear contracts and keep business rules independent from controllers.

## Consequences

- The first version is easier to run, test and deploy.
- Domain boundaries are visible before considering service extraction.
- A future module can be separated when ownership, load or release cadence justify it.
- The project still demonstrates architectural decision-making without pretending to be a large production system.

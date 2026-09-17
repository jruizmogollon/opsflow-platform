# Contributing to OpsFlow

OpsFlow is a learning and portfolio project, but changes should still be easy to review.

## Before opening a pull request

1. Keep the change focused on one problem.
2. Add or update tests when changing business behavior.
3. Run `dotnet test OpsFlow.slnx`.
4. Run `npm run build` inside `src/OpsFlow.Dashboard`.
5. Do not include credentials, personal data or generated build folders.

## Commit style

Use short, descriptive commits such as `feat: add ticket status filter` or `test: cover unknown ticket status update`.

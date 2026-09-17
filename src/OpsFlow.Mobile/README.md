# OpsFlow Mobile

Technician-facing Flutter client for OpsFlow Platform. It reads tickets from the ASP.NET Core API and lets a technician update their status from a mobile-friendly interface.

## Run locally

```bash
flutter pub get
flutter run
```

The default API URL is `http://10.0.2.2:5188` for an Android emulator. For a physical device, replace it with the computer's local network address in `lib/services/opsflow_api.dart`.

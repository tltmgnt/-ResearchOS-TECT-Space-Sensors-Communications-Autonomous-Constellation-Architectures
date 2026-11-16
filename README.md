# ResearchOS TECT — Space Sensors, Communications & Autonomous Constellation Architectures
Independent research foundation for pLEO architecture studies.

## Implemented
Browser workspace and CLI for fixed-snapshot spherical-Earth ground visibility, Earth-obstructed crosslinks, gateway reachability, minimum crosslink hops and declared satellite-outage comparisons. Includes an Earth-fixed position plot, scenario JSON editing, source/review notes, local study storage and JSON/CSV/Markdown exports.

This is a geometry and graph foundation. Sensor performance, orbit propagation, time coverage, physical communications links and flight autonomy are future work. See [model contract and roadmap](docs/MODEL.md).

## Run
Node 22+; no npm dependencies:
```sh
npm test
npm run build
python -m http.server 8000 --directory dist
```
Open http://localhost:8000. The repository root can also be served directly. Modules and demo JSON require localhost or HTTPS; file:// is unsupported.

## CLI
```sh
node cli.mjs example.json
node cli.mjs example.json results.json
node cli.mjs example.json results.csv
```
Output files refuse overwrite. Same study and model give the same geometry and routes. Export browser studies regularly; no account synchronization, telemetry or hardware connection is configured.

## Verification
Eight tests cover geometry, routing, outages, validation and export escaping. Node 22/24 CI runs syntax checks, tests, CLI and static packaging, then uploads app artifacts.
Local execution, interactive browser testing and hosting were unavailable during implementation; inspect CI results rather than assuming tests pass. Hosting is not configured.

Synthetic examples only. No operational validation, DARPA endorsement or novelty claim. Apache-2.0 license retained.

# Snapshot geometry and research contract
## Geometry
Earth is a declared sphere of radius 6371 km. Latitude/longitude are Earth-fixed spherical angles; satellite altitude is radial height above the sphere, restricted to 160–2000 km. Positions are inputs, not propagated ephemerides.

Cartesian position is r[cos(lat)cos(lon), cos(lat)sin(lon), sin(lat)]. Ground access requires the dot product of the unit ground-to-satellite vector and outward ground normal to be at least sin(minElevation), with 1e−12 numerical tolerance. This tests geometric line of sight only. At 90 degrees only overhead geometry passes within tolerance.

Satellite pairs link if Euclidean range is at most crosslinkKm and the nearest point on the connecting segment is strictly outside Earth's radius plus 1e−9 km. Links are undirected and unconstrained by pointing, capacity, frequency, or link budget. Zero-distance colocated satellites may link under this abstraction.

## Routing and outage
All satellites visible from the declared gateway are BFS roots. A site's gateway reachability requires visibility to a satellite in that connected component. Reported hops count crosslinks only; ground uplink/downlink hops are excluded. Multiple simultaneous access links are permitted. No direct ground-to-ground network is assumed. The gateway itself still requires satellite access to count as reachable. Unreachable hop count is null.

Baseline includes every satellite. Declared outage removes the listed satellite IDs and rebuilds links/routes. This deterministic graph recalculation is a toy autonomy research baseline, not onboard autonomy or a control policy. Sites are equally weighted. Site access fractions are not global surface coverage or time availability.

## Scope
No orbit propagation, revisit time, continuous coverage, collision screening, sensor detection, optical field of view, resolution, RF link budget, latency, congestion, power scheduling, cooperative planning, fault detection, or flight commands are implemented. No real constellation design or performance guarantee is claimed. These are independent research tools with no DARPA affiliation or demonstrated novelty.

## Evidence and evaluation
Source references and review notes are owner declarations, not verified measurements or authenticated approval. Preserve evidence separately. JSON is the canonical reproducible study input; CSV and Markdown are summaries. Browser storage is local to the origin.

Before extending this foundation: validate geometry independently; import authorized Earth-fixed snapshots with timestamps and reference-frame provenance; add propagation and compare against trusted ephemerides; add sensor and communications models with explicit units and calibration; evaluate distributed autonomy in a separate simulator. Browser keyboard/mobile and import/export verification remains outstanding.

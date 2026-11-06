// Load test for public routes. No dependencies: Node's fetch + a fixed-size worker pool.
// Usage: node tests/load/stress.mjs [baseUrl] [requestsPerRoute] [concurrency]
// Run against `next start`, never against production without telling the team.
const base = process.argv[2] ?? "http://localhost:3972";
const perRoute = Number(process.argv[3] ?? 300);
const concurrency = Number(process.argv[4] ?? 50);
const routes = [
  "/en", "/si", "/ta",
  "/en/vendors", "/si/vendors?category=photographer&city=kandy",
  "/en/plan/budget?total=3500000",
  "/en/vendors/does-not-exist", // 404 path still hits the database
];

const pct = (s, p) => s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];

async function run(route) {
  const times = []; const codes = {}; let errors = 0; let next = 0;
  const t0 = performance.now();
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (next < perRoute) {
      next++;
      const s = performance.now();
      try {
        const r = await fetch(base + route, { redirect: "manual" });
        await r.arrayBuffer();
        codes[r.status] = (codes[r.status] ?? 0) + 1;
      } catch { errors++; }
      times.push(performance.now() - s);
    }
  }));
  const secs = (performance.now() - t0) / 1000;
  times.sort((a, b) => a - b);
  return { route, rps: Math.round(perRoute / secs), p50: Math.round(pct(times, 50)), p95: Math.round(pct(times, 95)), p99: Math.round(pct(times, 99)), max: Math.round(times.at(-1)), codes, errors };
}

console.log(`base=${base} requests/route=${perRoute} concurrency=${concurrency}`);
const rows = [];
for (const r of routes) rows.push(await run(r));
console.table(rows.map(({ codes, ...r }) => ({ ...r, codes: JSON.stringify(codes) })));
const bad = rows.filter((r) => r.errors || Object.keys(r.codes).some((c) => Number(c) >= 500));
process.exitCode = bad.length ? 1 : 0;

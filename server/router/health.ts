export function handleHealth() {
  return new Response(JSON.stringify({ status: "OK", timestamp: Date.now(), uptime: Math.floor(performance.now() / 1000) }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

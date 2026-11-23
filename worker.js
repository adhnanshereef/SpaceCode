export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/execute") {
      if (request.method !== "POST") {
        return Response.json(
          { message: "Method not allowed" },
          { status: 405, headers: { Allow: "POST" } }
        );
      }

      if (!env.ONLINECOMPILER_API_KEY) {
        return Response.json(
          { message: "OnlineCompiler.io API key is not configured" },
          { status: 500 }
        );
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return Response.json(
          { message: "Invalid JSON request body" },
          { status: 400 }
        );
      }

      let upstream;
      try {
        upstream = await fetch(
          "https://api.onlinecompiler.io/api/v2/piston/execute",
          {
            method: "POST",
            headers: {
              Authorization: env.ONLINECOMPILER_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
      } catch {
        return Response.json(
          { message: "Unable to reach the OnlineCompiler.io API" },
          { status: 502 }
        );
      }

      const contentType =
        upstream.headers.get("content-type") || "application/json";
      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-store",
        },
      });
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },
};

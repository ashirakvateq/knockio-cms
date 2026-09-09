import { redirectMap } from "./data/redirects";

const HOSTINGER_ORIGIN = "https://content.knockio.com";

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    const url = new URL(request.url);

    const redirectKey = url.pathname.replace(/\/+$/, "") || "/";
    const redirectRule = redirectMap.get(redirectKey);
    if (redirectRule) {
      const redirectUrl = new URL(redirectRule.to, url.origin);
      return Response.redirect(redirectUrl.toString(), redirectRule.status ?? 301);
    }

    const originUrl = new URL(url.pathname + url.search, HOSTINGER_ORIGIN);

    const originHeaders = new Headers(request.headers);
    originHeaders.set("Host", "knockio.com");
    originHeaders.set("X-Forwarded-For", request.headers.get("CF-Connecting-IP") || "");
    originHeaders.set("X-Real-IP", request.headers.get("CF-Connecting-IP") || "");

    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const body = hasBody ? await request.arrayBuffer() : undefined;

    try {
      const originResponse = await fetch(originUrl, {
        method: request.method,
        headers: originHeaders,
        body,
        redirect: "manual",
      });

      const response = new Response(originResponse.body, originResponse);
      response.headers.set("X-Proxied-By", "knockio-astro-worker");

      return response;
    } catch (err) {
      console.error("Origin fetch failed:", err);
      return new Response("Bad Gateway", {
        status: 502,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
} satisfies ExportedHandler<Env>;

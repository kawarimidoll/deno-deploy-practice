/// <reference path="./deploy.d.ts" />
import { Log } from "./logger.ts";
const log = new Log({
  minLogLevel: Deno.env.get("DENO_DEPLOYMENT_ID") ? "info" : "debug",
});

addEventListener("fetch", (event) => {
  const { host, pathname, searchParams } = new URL(event.request.url);
  const params = Object.fromEntries([...searchParams.entries()]);

  log.info({ host, pathname, params });

  log.debug(Deno.env.toObject());
  log.warn(Deno.env.get("SECRET_TOKEN"));
  log.warn(Deno.env.get("SECRET_TOKEN2"));

  const message = "Hello Deno Deploy!";

  if (pathname.endsWith(".json")) {
    const response = new Response(JSON.stringify({ message, params }), {
      headers: { "content-type": "application/json" },
    });
    event.respondWith(response);
    return;
  }

  if (pathname === "/error") {
    log.error("error!");
  }

  const response = new Response(message + " from " + pathname, {
    headers: { "content-type": "text/plain" },
  });
  event.respondWith(response);
});

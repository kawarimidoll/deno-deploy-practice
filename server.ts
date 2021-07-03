/// <reference path="./deploy.d.ts" />

addEventListener("fetch", (event) => {
  const { host, pathname, searchParams } = new URL(event.request.url);
  const params = Object.fromEntries([...searchParams.entries()]);

  console.log({ host, pathname, params });

  const message = "Hello Deno Deploy!";

  if (pathname.endsWith(".json")) {
    const response = new Response(JSON.stringify({ message, params }), {
      headers: { "content-type": "application/json" },
    });
    event.respondWith(response);
    return;
  }

  const response = new Response(message + " from " + pathname, {
    headers: { "content-type": "text/plain" },
  });
  event.respondWith(response);
});

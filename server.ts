import { serveDir } from "https://deno.land/std@0.207.0/http/file_server.ts";

// TODO: Random emblem serving.
// TODO: Request for hashed content forever caching.
// TODO: Request for etagged content caching.
// TODO: Request for regular content caching.
// TODO: Add a server arg for this script which turns off caching.
// TODO: 404 response.

Deno.serve((req: Request) => {
  return serveDir(req, {
    fsRoot: "build",
    enableCors: true, // Required so that preview iframes can access fonts (for katex).
  });
});

import { serveDir } from "https://deno.land/std@0.207.0/http/file_server.ts";

Deno.serve((req: Request) => {
  // Normalise the path.
  // If path has a trailing slash, remove it.
  // Formulate the corresponding file path.
  //
  // Is the path for a willow emblem?
  //  then serve up a random one.
  //
  // Are we in development mode? Just serve the response with no caching headers.
  //
  // TODO (aljoscha): Could we have a file containing JSON with an array of all content-addressed paths?
  // Is the path a content-addressed asset?
  //  then serve up a response with a very very long cache expiry date.
  //
  // TODO (aljoscha): Could we have a file containing JSON with a mapping of build paths (e.g. /specs/index.html) to their corresponding etags?
  // Does the request have an etag, and the asset have an etag?
  //  then send 304 if etag is equivalent
  //  or send response with content otherwise (with etag caching header)
  //
  // Do we even have this asset?
  //  if yes, serve with common sense caching headers
  //  if no, return a 404 response and page.

  return serveDir(req, {
    fsRoot: "build",
    enableCors: true, // Required so that preview iframes can access fonts (for katex).
  });
});

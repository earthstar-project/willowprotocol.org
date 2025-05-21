import cachingInfo from "./build/cachinginfo.json" with { type: "json" };
import { extname, join } from "@std/path";
import { contentType } from "@std/media-types";
import { parseArgs } from "jsr:@std/cli/parse-args";

const emblemFileNames = [
  "a.png",
  "b.png",
  "c.png",
];

async function pickRandomEmblem() {
  const filename =
    emblemFileNames[Math.floor(Math.random() * emblemFileNames.length)];

  const file = await Deno.open(
    join("src", "assets", "emblems", filename),
  );

  return file.readable;
}

Deno.serve(async (req: Request) => {
  const flags = parseArgs(Deno.args, {
    boolean: ["dev"],
  });

  const isDevMode = flags.dev;

  // Normalise the path.

  const url = new URL(req.url);
  let normalisedPath = url.pathname;
  const extension = extname(url.pathname);

  // If path has a trailing slash, add index.html
  if (normalisedPath.endsWith("/")) {
    normalisedPath = `${normalisedPath}index.html`;
  }

  // Is the path for a willow emblem?
  //  then serve up a random one.
  if (url.pathname === "/assets/emblem.png") {
    console.log(200, url);

    return new Response(await pickRandomEmblem(), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "s-max-age=3600,max-age=3600,public",
      },
    });
  }

  // Formulate the corresponding file path.
  const fsPath = join(
    ".",
    "build",
    normalisedPath,
  );

  // Let's get a handle on that path.
  const file = await Deno.open(fsPath).catch(() => undefined);

  // If there's no file there, it's time to 404.
  if (!file) {
    console.warn(404, "NOT FOUND", normalisedPath);

    return new Response("No page found", {
      status: 404,
    });
  }

  const contentKind = extension === ""
    ? "text/html"
    : contentType(extension) || "text/plain";

  // Are we in development mode? Just serve the response with no caching headers.
  if (isDevMode) {
    console.log(200, "dev", url.pathname);

    return new Response(file.readable, {
      headers: {
        "Content-Type": contentKind,
      },
    });
  }

  // Is the path a content-addressed asset?
  //  then serve up a response with a very very long cache expiry date.
  if (cachingInfo.contentAddressedFiles.includes(normalisedPath)) {
    console.log(200, "content-addressed", url.pathname);

    return new Response(file.readable, {
      headers: {
        "Content-Type": contentKind,
        "Cache-Control": "s-max-age=31536000,max-age=31536000,public",
      },
    });
  }

  // Does the request have an etag, and the asset have an etag?
  const etag = (cachingInfo.etags as Record<string, string>)[normalisedPath];
  if (etag) {
    const ifNoneMatch = req.headers.get("If-None-Match");

    // If the request has an equivalent etag, send status 304
    if (
      ifNoneMatch && (ifNoneMatch === `W/${etag}` || ifNoneMatch === etag)
    ) {
      console.log(304, url.pathname);

      return new Response(undefined, {
        status: 304,
      });
    }

    // Or send the content with the current etag.
    console.log(200, url.pathname);

    return new Response(file.readable, {
      headers: {
        "Content-Type": contentKind,
        "ETag": etag,
        "Cache-Control": "s-max-age=3600,max-age=3600,public",
      },
    });
  }

  // (Covering our butts)
  // There's no etag, but there is a file.
  // Just send with common sense caching policy.
  console.warn(200, "NOT ETAGGED!", url.pathname);

  return new Response(file.readable, {
    headers: {
      "Content-Type": contentKind,
      "Cache-Control": "s-max-age=3600,max-age=3600,public",
    },
  });
});

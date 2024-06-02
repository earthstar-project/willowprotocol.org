import { dirname } from "std/path/dirname.ts";
import { contentType } from "std/media_types/mod.ts";
import { extname } from "std/path/extname.ts";
import { join } from "std/path/join.ts";
import { createHash } from "npm:sha256-uint8array";

const emblemFileNames = [
  "a.png",
  "b.png",
  "c.png",
];

async function pickRandomEmblem() {
  const filename =
    emblemFileNames[Math.floor(Math.random() * emblemFileNames.length)];

  const file = await Deno.open(
    join("willowtest", "named_assets", "emblems", filename),
  );

  return file.readable;
}

Deno.serve(async (req) => {
  // Check built assets for matching pathname.

  const url = new URL(req.url);

  if (url.pathname === "/emblem.png") {
    return new Response(await pickRandomEmblem(), {
      headers: {
        "Content-Type": "image/png",
      },
    });
  }

  try {
    const extension = extname(url.pathname);

    // Special carve-out for RSS feeds.
    if (extension === ".xml") {
      const filePath = join(
        ".",
        "willowtest",
        "build",
        url.pathname,
      );

      const etag = createHash().update(await Deno.readTextFile(filePath))
        .digest("hex");

      const ifNoneMatch = req.headers.get("If-None-Match");

      if (
        ifNoneMatch && (ifNoneMatch === `W/${etag}` || ifNoneMatch === etag)
      ) {
        console.log(304, "RSS", url.pathname);

        return new Response(undefined, {
          status: 304,
        });
      }

      const file = await Deno.open(filePath);

      console.log(200, "RSS", url.pathname);

      return new Response(file.readable, {
        headers: {
          "Content-Type": "application/rss+xml",
          "ETag": etag,
          "Cache-Control": "s-max-age=3600,max-age=3600,public",
        },
      });
    }

    const longCacheDirs = ["/assets", "/previews"];

    // Content-addressed items get a long-lived cache policy
    if (longCacheDirs.includes(dirname(url.pathname))) {
      const filePath = join(
        ".",
        "willowtest",
        "build",
        url.pathname,
      );

      const file = await Deno.open(filePath);

      const contentKind = contentType(extension) || "text/plain";

      console.log(200, "content-addressed", url.pathname);

      return new Response(file.readable, {
        headers: {
          "Content-Type": contentKind,
          "Cache-Control": "s-max-age=31536000,max-age=31536000,public",
        },
      });
    }

    // All HTML assets have reasonable cache policies
    // And ETags for clients to revalidate with
    const filePath = !extension
      ? join(
        ".",
        "willowtest",
        "build",
        url.pathname,
        "index.html",
      )
      : join(".", "willowtest", "build", url.pathname);

    const etagPath = !extension
      ? join(".", "willowtest", "build", url.pathname, "etag")
      : join(".", "willowtest", "build", dirname(url.pathname), "etag");

    try {
      const etag = await Deno.readTextFile(etagPath);

      const ifNoneMatch = req.headers.get("If-None-Match");

      if (
        ifNoneMatch && (ifNoneMatch === `W/${etag}` || ifNoneMatch === etag)
      ) {
        console.log(304, url.pathname);

        return new Response(undefined, {
          status: 304,
        });
      }

      try {
        const fileBytes = await Deno.readFile(filePath);

        const contentKind = extension === ""
          ? "text/html"
          : contentType(extension) || "text/plain";

        return new Response(fileBytes, {
          headers: {
            "Content-Type": contentKind,
            "ETag": etag,
            "Cache-Control": "s-max-age=3600,max-age=3600,public",
          },
        });
      } catch {
        console.log(404, url.pathname);
        // No file at this path.
        return new Response("Page not found", {
          status: 404,
        });
      }
    } catch {
      // No etag.
      try {
        const fileBytes = await Deno.readFile(filePath);

        const contentKind = extension === ""
          ? "text/html"
          : contentType(extension) || "text/plain";

        return new Response(fileBytes, {
          headers: {
            "Content-Type": contentKind,
            "Cache-Control": "s-max-age=3600,max-age=3600,public",
          },
        });
      } catch {
        console.log(404, url.pathname);
        // No file at this path.
        return new Response("Page not found", {
          status: 404,
        });
      }
    }
  } catch {
    // Make a nicer 404 page with the macro system.
    return new Response("Page not found", {
      status: 404,
    });
  }
});

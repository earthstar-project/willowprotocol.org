import { contentType } from "std/media_types/mod.ts";
import { extname } from "std/path/extname.ts";
import { join } from "std/path/join.ts";

Deno.serve(async (req) => {
  // Check built assets for matching pathname.

  const url = new URL(req.url);

  if (url.pathname === "emblem.png") {
    // TODO: Serve up a random emblem.
  }

  try {
    const extension = extname(url.pathname);

    if (!extension) {
      // This is a call for a webpage. e.g. /specs/sync
      // Check for index.

      const filePath = join(
        ".",
        "willowtest",
        "build",
        url.pathname,
        "index.html",
      );

      const etagPath = join(".", "willowtest", "build", url.pathname, "etag");

      try {
        const etag = await Deno.readTextFile(etagPath);

        const ifNoneMatch = req.headers.get("If-None-Match");

        if (ifNoneMatch && ifNoneMatch === etag) {
          console.log(304, url.pathname);

          return new Response(undefined, {
            status: 304,
          });
        }

        try {
          const htmlFile = await Deno.open(filePath);

          console.log(200, url.pathname);

          return new Response(htmlFile.readable, {
            headers: {
              "Content-Type": "text/html",
              "Etag": etag,
              "Cache-Control": "public, max-age 3600, s-maxage 3600",
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
          console.log(filePath);

          const htmlFile = await Deno.open(filePath);

          return new Response(htmlFile.readable, {
            headers: {
              "Content-Type": "text/html",
              "Cache-Control": "public, max-age 3600, s-maxage 3600",
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
    }

    // This is a request for another resource.

    const filePath = join(
      ".",
      "willowtest",
      "build",
      url.pathname,
    );

    const file = await Deno.open(filePath);

    const contentKind = contentType(extension) || "text/plain";

    // If content kind is HTML, look for an etag.

    console.log(200, url.pathname);

    return new Response(file.readable, {
      headers: {
        "Content-Type": contentKind,
        "Cache-Control": (contentKind === "text/css"
          ? ""
          : "public, max-age 3600, s-maxage 3600"),
      },
    });
  } catch {
    // Make a nicer 404 page with the macro system.
    return new Response("Page not found", {
      status: 404,
    });
  }
});

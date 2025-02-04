# Macromania Webserver Root

Many webtechnologies need to know about the root of the webserver they are
running in, or about its domain. This module provides a `ServerRoot` macro that
can give such context to other macros. To be used together with the
[OutFS](https://github.com/worm-blossom/macromania-outfs) macros.

```tsx
<Dir name="build">
  <ServerRoot url="https://example.org">
    <Dir name="stuff">
        <File name="foo.txt">
            <impure fun={(ctx) => {
                return <>
                    {serverUrl(ctx)} is "https://example.org"
                    {serverMount(ctx)} is ["build"]
                    {serverPath(ctx)} is ["stuff"]
                    {outFilename(ctx)} is "foo.txt" (unrelated but useful)
                </>;
            }} />
        </File>
    </Dir>
  </ServerRoot>
</Dir>
```

If called outside any `<ServerRoot>` macro, then `serverUrl(ctx)` returns
`null`, `serverMount(ctx)` returns `[]` (the empty array), and `serverPath(ctx)`
returns the same as `outDir(ctx)`.

Macros that wish to use the information provided by this module should
gracefully handle when the evaluated expression contains no `<ServerRoot>` at
all (unless they absolutely require knowledge about the server). The idea is
that projects that generate files for only a single web server need not actively
use this package (i.e., invoke the `<ServerRoot>` macro) at all. It primarily
serves to disambiguate information when generating the files for multiple web
servers at once.

Nested `<ServerRoot>` macros cause an error at evaluation time.

## Linking

Use the `hrefTo(ctx: Context, target: OutFsPath): string` to obtain
a link from the current file to the `target` file or directory.

By default, chooses between relative and absolute links purely based on which
are shorter. Specify `<ConfigWebserverRoot linkType="absolute" />` in a
[`<Config>` block](https://github.com/worm-blossom/macromania_config) to emit
absolute links only, or specify `<ConfigWebserverRoot linkType="relative" />`
to emit relative links whenever possible.
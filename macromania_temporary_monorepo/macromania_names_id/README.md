# Macromania NamesId

[Macromania](https://github.com/worm-blossom/macromania) macros for registering HTML elements with ids and automatically creating links to them.

Use `addName(ctx: Context, name: string, id?: string)` to register a new element (`id` defaults to `name`), then use

- `getName(ctx: Context, name: string): NameInfo | undefined` to retrieve the information associated with the name (domain name, path to its file, its id),
- `getNameAndDebug(ctx: Context, name: string): [NameInfo, DebuggingInformation] | undefined` to also retrieve information about where the name was registered,
- `hrefToName(ctx: Context, name: string): string | null` to obtain a link from the current file to the registered element,
- or the `<IdA>` macro to create an `<a>` HTMl tag linking to the element. 

Uses [macromania_outfs](https://github.com/worm-blossom/macromania_outfs) to determine the path components of URLs, and optionally uses [macromania_webserverroot](https://github.com/worm-blossom/macromania-webserverroot) to determine domain names and urls.

See [`./test/tests.tsx`](./test/tests.tsx) for examples.

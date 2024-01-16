# We Are Sorry

This repository houses a completely undocumented, experimental macro expansion system for generating text documents. It also houses the source of [https://willowprotocol.org/](https://willowprotocol.org/), which augments the undocumented macro expander with a diverse set of undocumented macros, often of abysmal code quality.

On the bright side, we consider the macro system a success and will eventually create a clean, well-documented, standalone version of it. Until then, unfortunately, the source for the Willow website (including for all the specifications) will stay rather inaccessible. We welcome issues on even the most trivial typo fixes, and will happily take care of them.

For the brave who do want to venture into the source:

- The webpages themselves live in the [https://github.com/earthstar-project/tsgen/tree/main/willowtest/specs](https://github.com/earthstar-project/tsgen/tree/main/willowtest/specs) directory, with assets and css residing [one level higher](https://github.com/earthstar-project/tsgen/tree/main/willowtest).
- The entrypoint to rendering the site is [`main.ts`](https://github.com/earthstar-project/tsgen/blob/main/willowtest/main.ts) (not to be confused with the *other* [`main.ts`](https://github.com/earthstar-project/tsgen/blob/main/main.ts) 🫠).
- The macro expander is defined in [`tsgen.ts`](https://github.com/earthstar-project/tsgen/blob/main/tsgen.ts).

Again, we are sorry, but it is what it is.
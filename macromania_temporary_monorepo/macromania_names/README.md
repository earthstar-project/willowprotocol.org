# Macromania Names

Helper functions for [Macromania](https://github.com/worm-blossom/macromania)
for dynamically binding data to string names.

Exposes a single function `createNamespace`, which returns functions for binding
and resolving names. `createNamespace` takes a title for the namespace (for
debugging purposes only) as a first argument, and an optional boolean
`isDynamic` (defaulting to `false`) as a second argument. If `isDynamic`, the
returned function for binding a name can overwrite a previous name, otherwise,
it halts evaluaton when attempting to bind a name a second time.

```tsx
const animals = createNamespace<string>("Animals");

<>
  <impure
    fun={(ctx) => {
      animals.addName(ctx, "cat", "pretty cool");
      return "";
    }}
  />
  <impure
    fun={(ctx) => {
      return animals.getName(ctx, "cat")!;
    }}
  />
  />
</>
// Evaluates to `"pretty cool`.
```

For more examples, see [`./test/tests.tsx`](./test/tests.tsx).
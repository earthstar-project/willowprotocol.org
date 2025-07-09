# Macromania OutFS

Macros for [Macromania](https://github.com/worm-blossom/macromania) to describe
output directory structures via nested macros:

```tsx
<Dir name="recipes">
  <File name="index.md">These are good recipes.</File>
  <Dir name="dessert">
    <File name="chocolate_cake.md">Mix chocolate and cake, serve in bowl.</File>
    <File name="icecream.md">Put cream into freezer, then eat quickly.</File>
  </Dir>
</Dir>;
```

Creates a directory hierarchy (in the real file system, rooted at the current
working directory of the process):

```
- recipes
    - index.md
    - dessert
        - chocolate_cake.md
        - icecream.md
```

The macros internally track a "current out directory" in the directory
hierarchy. Use the `outCwd` and `outFilename` functions to access the current
position from other macros.

```tsx
<Dir name="foo">
  {/* evaluates to `/foo;null`*/}
  <impure fun={(ctx) => {
    return `${renderOutFsPath(outCwd(ctx))};${outFilename(ctx)}`;
  }} />
  <Dir name="bar">
    <File name="baz.txt">
      {/* evaluates to `/foo/bar;baz.txt`*/}
      <impure fun={(ctx) => {
        return `${renderOutFsPath(outCwd(ctx))};${outFilename(ctx)}`;
      }} />
    </File>
  </Dir>
</Dir>
```

You can change the current out directory with the `Cd` macro, to create
directories and files outside the current position (intended less for writing by
hand but more as an implementation detail of other macros):

```tsx
<Dir name="recipes">
  <Dir name="dessert">
    {/* without the `create` flag it would not create the dir but error*/}
    <Cd path={absoluteOutFsPath(["recipes", "breakfast"])} create>
      <File name="breadrolls.md">
        Buy bread, roll on the floor for 48 hours.
      </File>
    </Cd>
    {/* The number gives the number of ".." at the start of the path.*/}
    <Cd path={relativeOutFsPath(["breakfast"], 1)}>
      <File name="cereals.md">
        If you need a recipe, you are doing it wrong.
      </File>
    </Cd>
    <File name="icecream.md">Put cream into freezer, then eat quickly.</File>
  </Dir>
</Dir>;
```

Produces:

```
- recipes
    - dessert
      - icecream.md
    - breakfast
        - breadrolls.md
        - cereals.md
```

The `Dir` and `File` macros take an optional `mode` prop to guide what happens
if a file already exists: `"timid"` is the default mode, it halts evaluation
with an error. `"placid"` leaves any preexisting file of the same name
untouched. `"assertive"` overwrites any preexisting file of the same name.

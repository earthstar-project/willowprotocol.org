import { expandEmbeddedImportMap } from "https://deno.land/x/esbuild_deno_loader@0.9.0/src/shared.ts";
import {
  CommentLine,
  Deemph,
  Def,
  Delimited,
  dependencyCss,
  dependencyJs,
  Div,
  exposeCssAndJsDependencies,
  FakePseudocode,
  Indent,
  InlineComment,
  Keyword,
  Keyword2,
  Loc,
  mapMaybeCommented,
  MaybeCommented,
  PreviewScope,
  PreviewScopePopWrapper,
  PreviewScopePushWrapper,
  Pseudocode,
  R,
} from "../mod.tsx";
import {
  Code,
  Config,
  ConfigWebserverRoot,
  Li,
  Ol,
  Span,
  styleAssetPath,
} from "./deps.ts";
import {
  absoluteOutFsPath,
  Cd,
  createConfigOptions,
  ScriptDependencyInfo,
  StylesheetDependencyInfo,
  TagProps,
} from "./deps.ts";
import {
  Colors,
  Context,
  createLogger,
  createSubstate,
  Expression,
  Expressions,
  File,
  Html5,
} from "./deps.ts";
import { SpliceLoc } from "../mod.tsx";
import { Delimiters } from "../mod.tsx";
import { DefProps } from "../mod.tsx";
import { EscapeHtml } from "../mod.tsx";

const l = createLogger("LoggerRustic");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerRustic };

export type RusticConfig = {
  /**
   * How many colors to cycle through for the rainbow delimiters.
   * Defaults to three.
   */
  colorsOfTheRainbow?: number;
};

const [
  getRusticConfig,
  ConfigRustic,
] = createConfigOptions<RusticConfig, RusticConfig>(
  "ConfigRustic",
  () => ({
    colorsOfTheRainbow: 3,
  }),
  (oldValue, update) => {
    const newValue = { ...oldValue };
    if (update.colorsOfTheRainbow !== undefined) {
      newValue.colorsOfTheRainbow = update.colorsOfTheRainbow;
    }

    return newValue;
  },
);
export { ConfigRustic };

type RusticState = {
  previewAnnotation: Expressions | null;
};

const [getState, setRusticState] = createSubstate<
  RusticState
>(
  () => ({
    previewAnnotation: null,
  }),
);

function rusticDef(props: DefProps, extraClass: string): Expression {
  return (
    <impure
      fun={(ctx) => {
        const [cssDeps, jsDeps] = exposeCssAndJsDependencies(ctx);

        const defClass: Expression[] = ["rustic", extraClass];
        if (Array.isArray(props.defClass)) {
          props.defClass.forEach((clazz) => defClass.push(clazz));
        } else if (props.defClass !== undefined) {
          defClass.push(props.defClass);
        }

        const refClass: Expression[] = ["rustic", extraClass];
        if (Array.isArray(props.refClass)) {
          props.refClass.forEach((clazz) => refClass.push(clazz));
        } else if (props.refClass !== undefined) {
          refClass.push(props.refClass);
        }

        for (const dep of cssDeps) {
          dependencyCss(ctx, dep);
        }
        for (const dep of jsDeps) {
          dependencyJs(ctx, dep);
        }

        return Def({ ...props, defClass, refClass });
      }}
    />
  );
}

/**
 * Create a DefRef definition for a value.
 */
export function DefValue(props: DefProps): Expression {
  return rusticDef(props, "value");
}

/**
 * Create a DefRef definition for a type.
 */
export function DefType(props: DefProps): Expression {
  return rusticDef(props, "type");
}

/**
 * Create a DefRef definition for a field.
 */
export function DefField(props: DefProps): Expression {
  return rusticDef(props, "field");
}

/**
 * Create a DefRef definition for an enum variant.
 */
export function DefVariant(props: DefProps): Expression {
  return rusticDef(props, "variant");
}

/**
 * Create a DefRef definition for a function.
 */
export function DefFunction(props: DefProps): Expression {
  return rusticDef(props, "function");
}

/**
 * Create a DefRef definition for an interface.
 */
export function DefInterface(props: DefProps): Expression {
  return rusticDef(props, "interface");
}

/**
 * Create a DefRef definition for a type argument.
 */
export function DefTypeArg(props: DefProps): Expression {
  return rusticDef(props, "typeArg");
}

/**
 * Wrap some code in parens, to make associativity explicit.
 */
export function Parens({ children }: { children?: Expressions }): Expression {
  return (
    <Delimiters delims={["(", ")"]}>
      <exps x={children} />
    </Delimiters>
  );
}

export type TupleTypeProps = {
  types?: MaybeCommented<Expressions>[];
  multiline?: boolean;
};

/**
 * An anonymous tuple type, i.e., an anonymous product.
 */
export function TupleType(
  { types, multiline }: TupleTypeProps,
): Expression {
  return (
    <Delimited
      delims={["(", ")"]}
      content={types ?? []}
      multiline={multiline}
      separator=","
    />
  );
}

/**
 * An anonymous choice type, i.e., an anonymous sum.
 */
export function ChoiceType(
  { types, multiline }: {
    types: MaybeCommented<Expressions>[];
    multiline?: boolean;
  },
): Expression {
  const separatedContent: Expressions = [];
  for (let i = 0; i < types.length; i++) {
    let exps: Expressions;
    let comment: Expressions | undefined = undefined;
    let commentDedicatedLine = false;

    const currentType = types[i];
    if (
      typeof currentType === "object" && "commented" in currentType
    ) {
      exps = currentType.commented.segment;
      comment = currentType.commented.comment;
      commentDedicatedLine = !!currentType.commented.dedicatedLine;
    } else {
      exps = currentType;
    }

    const addPipe = multiline || (i > 0);

    const stuffToRender: Expression[] = addPipe
      ? [
        <>
          <Deemph>|</Deemph>
          {" "}
        </>,
      ]
      : [];

    stuffToRender.push(<exps x={exps} />);

    if (!multiline) {
      stuffToRender.push(" ");

      if (comment !== undefined) {
        stuffToRender.push(
          <>
            <InlineComment>
              <exps x={comment} />
            </InlineComment>
            {" "}
          </>,
        );
      }
    }

    if (multiline) {
      if (comment !== undefined && commentDedicatedLine) {
        separatedContent.push(
          <CommentLine>
            <exps x={comment} />
          </CommentLine>,
        );
      }

      separatedContent.push(
        <Loc
          comment={comment !== undefined && !commentDedicatedLine
            ? comment
            : undefined}
        >
          <exps x={stuffToRender} />
        </Loc>,
      );
    } else {
      separatedContent.push(<exps x={stuffToRender} />);
    }
  }

  const betweenDelimiters = multiline
    ? (
      <SpliceLoc>
        <Indent>
          <exps x={separatedContent} />
        </Indent>
      </SpliceLoc>
    )
    : <exps x={separatedContent} />;

  return betweenDelimiters;
}

export type FunctionTypeProps = {
  /**
   * Generic type arguments.
   */
  generics?: MaybeCommented<TypeArgument>[];
  /**
   * Whether to render each type argument in its own line.
   */
  multilineGenerics?: boolean;
  /**
   * The sequence of argument types.
   */
  args: MaybeCommented<Expression>[];
  /**
   * The return type.
   */
  ret: Expressions;
  /**
   * Whether to render the argument types one type per line.
   */
  multiline?: boolean;
};

/**
 * A function type.
 */
export function FunctionType(
  { args, ret, multiline, generics, multilineGenerics }: FunctionTypeProps,
): Expression {
  return (
    <>
      <RenderTypeArguments args={generics} multiline={multilineGenerics} />
      <Delimited
        delims={["(", ")"]}
        content={args}
        multiline={multiline}
        separator=","
      />
      {` `}
      <Deemph>{`->`}</Deemph>
      {` `}
      <exps x={ret} />
    </>
  );
}

export type FunctionTypeNamedProps = {
  /**
   * Generic type arguments.
   */
  generics?: MaybeCommented<TypeArgument>[];
  /**
   * Whether to render each type argument in its own line.
   */
  multilineGenerics?: boolean;
  /**
   * The sequence of argument names and their types (name first, unique id second, type third).
   */
  args: MaybeCommented<[string, string, Expression]>[];
  /**
   * The return type.
   */
  ret: Expressions;
  /**
   * Whether to render the argument types one type per line.
   */
  multiline?: boolean;
};

/**
 * A function type.
 */
export function FunctionTypeNamed(
  { args, ret, multiline, generics, multilineGenerics }: FunctionTypeNamedProps,
): Expression {
  return (
    <FunctionType
      generics={generics}
      multilineGenerics={multilineGenerics}
      args={mapMaybeCommented(args, ([id, n, type]) => (
        <TypeAnnotation
          type={type}
        >
          <RenderFreshValue id={[id, n]} />
        </TypeAnnotation>
      ))}
      ret={ret}
      multiline={multiline}
    />
  );
}

/**
 * The type to indicate fresh ids that should be bound. Use a string if the id itself can be used as a DefRef `n` prop, use a pair of the id first and the desired `n` prop second otherwise. Add a third Expression that specifies a plural form (the `rs` prop) if needed.
 */
export type FreshId = string | [Expression, string] | [Expression, string, Expression];

function freshIdN(id: FreshId): string {
  return Array.isArray(id) ? id[1] : id;
}

function freshIdId(id: FreshId): Expression {
  return Array.isArray(id) ? id[0] : id;
}

export function RenderFreshValue(
  { id }: { id: FreshId },
): Expression {
  if (Array.isArray(id)) {
    if (id.length === 2) {
      return <DefValue n={id[1]} r={id[0]} />;
    } else {
      return <DefValue n={id[1]} r={id[0]} rs={id[2]} />;
    }
  } else {
    return <DefValue n={id} r={id} />;
  }
}

export function RenderFreshFunction(
  { id }: { id: FreshId },
): Expression {
  if (Array.isArray(id)) {
    if (id.length === 2) {
      return <DefFunction n={id[1]} r={id[0]} />;
    } else {
      return <DefFunction n={id[1]} r={id[0]} rs={id[2]} />;
    }
  } else {
    return <DefFunction n={id} r={id} />;
  }
}

export function RenderFreshType(
  { id }: { id: FreshId },
): Expression {
  if (Array.isArray(id)) {
    if (id.length === 2) {
      return <DefType n={id[1]} r={id[0]} />;
    } else {
      return <DefType n={id[1]} r={id[0]} rs={id[2]} />;
    }
  } else {
    return <DefType n={id} r={id} />;
  }
}

export function RenderFreshField(
  { id }: { id: FreshId },
): Expression {
  if (Array.isArray(id)) {
    if (id.length === 2) {
      return <DefField n={id[1]} r={id[0]} />;
    } else {
      return <DefField n={id[1]} r={id[0]} rs={id[2]} />;
    }
  } else {
    return <DefField n={id} r={id} />;
  }
}

export function RenderFreshVariant(
  { id }: { id: FreshId },
): Expression {
  if (Array.isArray(id)) {
    if (id.length === 2) {
      return <DefVariant n={id[1]} r={id[0]} />;
    } else {
      return <DefVariant n={id[1]} r={id[0]} rs={id[2]} />;
    }
  } else {
    return <DefVariant n={id} r={id} />;
  }
}

export function RenderFreshInterface(
  { id }: { id: FreshId },
): Expression {
  if (Array.isArray(id)) {
    if (id.length === 2) {
      return <DefInterface n={id[1]} r={id[0]} />;
    } else {
      return <DefInterface n={id[1]} r={id[0]} rs={id[2]} />;
    }
  } else {
    return <DefInterface n={id} r={id} />;
  }
}

export function RenderFreshTypeArg(
  { id, fake }: { id: FreshId; fake?: boolean },
): Expression {
  if (Array.isArray(id)) {
    if (id.length === 2) {
      return <DefTypeArg n={id[1]} r={id[0]} fake={fake} />;
    } else {
      return <DefTypeArg n={id[1]} r={id[0]} rs={id[2]} fake={fake} />;
    }
  } else {
    return <DefTypeArg n={id} r={id} fake={fake} />;
  }
}

export type ArrayTypeProps = {
  /**
   * The type of values contained in the arrays.
   */
  children: Expressions;
  /**
   * How many items each array contains.
   */
  count: Expressions;
};

/**
 * An array type, i.e., a sequence of known length containing values of the same type.
 */
export function ArrayType(
  { children, count }: ArrayTypeProps,
): Expression {
  return (
    <Delimited
      delims={["[", "]"]}
      content={[children, count]}
      separator=";"
    />
  );
}

export type PointerTypeProps = {
  /**
   * The type of values that the pointer can point to.
   */
  children: Expressions;
  /**
   * Whether the pointer allows mutation, or is writeonly, or full opaque.
   */
  mut?: boolean | "writeonly" | "opaque";
};

/**
 * A pointer type, i.e., a reference to exactly one value.
 * Please keep null pointers out of pseudocode. Thank you.
 */
export function PointerType(
  { children, mut }: PointerTypeProps,
): Expression {
  const kw: Expression = mut
    ? (typeof mut === "boolean" ? <Mut /> : <Keyword2>{mut}</Keyword2>)
    : "";
  return (
    <>
      <Deemph>&</Deemph>
      {kw}
      {kw === "" ? "" : " "}
      <exps x={children} />
    </>
  );
}

/**
 * A slice type, i.e., a reference to zero or more values, consecutively stored in memory.
 */
export function SliceType(
  { children, mut }: PointerTypeProps,
): Expression {
  const kw: Expression = mut
    ? (typeof mut === "boolean" ? <Mut /> : <Keyword2>{mut}</Keyword2>)
    : "";
  return (
    <>
      <Deemph>&</Deemph>
      {kw}
      {kw === "" ? "" : " "}
      <Delimiters delims={["[", "]"]}>
        <exps x={children} />
      </Delimiters>
    </>
  );
}

export type TypeApplicationRawProps = {
  /**
   * The type constructor.
   */
  constr: Expressions;
  /**
   * The sequence of argument types.
   */
  args: MaybeCommented<Expression>[];
  /**
   * Whether to render the args one argument per line.
   */
  multiline?: boolean;
};

/**
 * A type application for an arbitrary type constructor expression.
 */
export function TypeApplicationRaw(
  { args, constr, multiline }: TypeApplicationRawProps,
): Expression {
  return (
    <>
      <exps x={constr} />
      <Delimited
        delims={[
          <EscapeHtml>{"<"}</EscapeHtml>,
          <EscapeHtml>{">"}</EscapeHtml>,
        ]}
        content={args}
        multiline={multiline}
        separator=","
      />
    </>
  );
}

export type TypeApplicationProps = {
  /**
   * The DefRef id of the type constructor.
   */
  constr: string;
  /**
   * The sequence of argument types.
   */
  args: MaybeCommented<Expression>[];
  /**
   * Whether to render the args one argument per line.
   */
  multiline?: boolean;
};

/**
 * A type application for a type constructor given by a DefRef id.
 */
export function TypeApplication(
  { args, constr, multiline }: TypeApplicationProps,
): Expression {
  return TypeApplicationRaw({ args, constr: <R n={constr} />, multiline });
}

/**
 * An ascii greater-than operator.
 */
export function Gt(): Expression {
  return <EscapeHtml>{">"}</EscapeHtml>;
}

/**
 * An ascii greater-than-or-equal-to operator.
 */
export function Gte(): Expression {
  return <EscapeHtml>{">="}</EscapeHtml>;
}

/**
 * An ascii less-than operator.
 */
export function Lt(): Expression {
  return <EscapeHtml>{"<"}</EscapeHtml>;
}

/**
 * An ascii less-than-or-equal-to operator.
 */
export function Lte(): Expression {
  return <EscapeHtml>{"<="}</EscapeHtml>;
}

/**
 * An ascii bitwise-and operator.
 */
export function And(): Expression {
  return <EscapeHtml>{"&"}</EscapeHtml>;
}

/**
 * An ascii logical-and operator.
 */
export function Land(): Expression {
  return <EscapeHtml>{"&&"}</EscapeHtml>;
}

/**
 * A type annotation.
 */
export function TypeAnnotation(
  { children, type }: { children: Expressions; type: Expressions },
): Expression {
  return (
    <>
      <exps x={children} />
      <Deemph>:</Deemph>
      {` `}
      <exps x={type} />
    </>
  );
}

export type TupleProps = {
  /**
   * An optional name to preface the tuple with.
   */
  name?: Expressions;
  /**
   * Whether to give each field its on line of code.
   */
  multiline?: boolean;
  /**
   * The field expressions.
   */
  fields?: MaybeCommented<Expressions>[];
};

/**
 * An anonymous tuple, i.e., an anonymous product expression. Optionally less anonymous by prefixing it with a name (the fields remain anonymous though).
 */
export function Tuple(
  { name, fields = [], multiline }: TupleProps,
): Expression {
  return (
    <>
      {name === undefined ? "" : <exps x={name} />}
      {fields.length === 0 && name !== undefined ? "" : (
        <Delimited
          delims={["(", ")"]}
          content={fields}
          multiline={multiline}
          separator=","
          noRainbow={!name}
        />
      )}
    </>
  );
}

export type TupleStructProps = {
  /**
   * The Defref id of the tuple struct.
   */
  name: string;
  /**
   * Whether to give each field its on line of code.
   */
  multiline?: boolean;
  /**
   * The field expressions.
   */
  fields?: MaybeCommented<Expressions>[];
};

/**
 * A tuple struct, using DefRef to refer to the name of the tuple.
 */
export function TupleStruct(
  { name, fields = [], multiline }: TupleStructProps,
): Expression {
  return <Tuple name={<R n={name} />} fields={fields} multiline={multiline} />;
}

export type AccessProps = {
  /**
   * The expression to access.
   */
  children: Expressions;
  /**
   * Where to perform the access.
   */
  at: Expressions;
};

/**
 * Access a part of an expression.
 */
export function Access(
  { children, at }: AccessProps,
): Expression {
  return (
    <>
      <exps x={children} />
      <Deemph>.</Deemph>
      <exps x={at} />
    </>
  );
}

export type AccessTupleProps = {
  /**
   * The expression to access.
   */
  children: Expressions;
  /**
   * Where to perform the access.
   */
  at: number;
};

/**
 * Access a part of an expression.
 */
export function AccessTuple(
  { children, at }: AccessTupleProps,
): Expression {
  return <Access children={children} at={`${at}`} />;
}

export type RecordProps = {
  /**
   * An optional name to preface the record with.
   */
  name?: Expressions;
  /**
   * Whether to give each field its on line of code.
   */
  multiline?: boolean;
  /**
   * The field names and the associated expressions.
   */
  fields?: MaybeCommented<[Expressions, Expression]>[];
};

/**
 * A key-value mapping, optionally with a name preceding it.
 */
export function Record(
  { name, fields = [], multiline }: RecordProps,
): Expression {
  return (
    <>
      {name === undefined ? "" : (
        <>
          <exps x={name} />
          {" "}
        </>
      )}
      <Delimited
        delims={["{", "}"]}
        multiline={multiline}
        separator=","
        content={mapMaybeCommented(fields, ([field, exp]) => (
          <>
            <exps x={field} />
            <Deemph>:</Deemph> <exps x={exp} />
          </>
        ))}
      />
    </>
  );
}

export type StructProps = {
  /**
   * Defref id of the struct.
   */
  name: string;
  /**
   * Whether to give each field its on line of code.
   */
  multiline?: boolean;
  /**
   * The field names and the associated expressions.
   */
  fields?: MaybeCommented<[string, Expression]>[];
};

/**
 * A struct mapping, using DefRef to refer struct name and field names.
 */
export function Struct(
  { name, fields = [], multiline }: StructProps,
): Expression {
  return (
    <Record
      name={<R n={name} />}
      multiline={multiline}
      fields={mapMaybeCommented(
        fields,
        ([field, exp]) => [<R n={field} />, exp],
      )}
    />
  );
}

export type AccessStructProps = {
  /**
   * The expression to access.
   */
  children: Expressions;
  /**
   * Where to perform the access.
   */
  field: string;
};

/**
 * Access a part of an expression.
 */
export function AccessStruct(
  { children, field }: AccessStructProps,
): Expression {
  return <Access children={children} at={<R n={field} />} />;
}

export type EnumLiteralRawProps = {
  /**
   * The name of the enum.
   */
  name: Expressions;
  /**
   * Everything after the `name::`.
   */
  children: Expressions;
};

/**
 * An anonymous tuple, i.e., an anonymous product expression. Optionally less anonymous by prefixing it with a name (the fields remain anonymous though).
 */
export function EnumLiteralRaw(
  { name, children }: EnumLiteralRawProps,
): Expression {
  return (
    <>
      <exps x={name} />
      <Deemph>::</Deemph>
      <exps x={children} />
    </>
  );
}

export type EnumLiteralProps = {
  /**
   * The Defref id of the enum.
   */
  name: string;
  /**
   * Everything after the `name::`.
   */
  children: Expressions;
};

/**
 * A tuple struct, using DefRef to refer to the name of the tuple.
 */
export function EnumLiteral(
  { name, children }: EnumLiteralProps,
): Expression {
  return <EnumLiteralRaw name={<R n={name} />} children={children} />;
}

export type IsVariantProps = {
  /**
   * The enum variant to test for.
   */
  variant: Expressions;
  /**
   * The expression to test.
   */
  children: Expressions;
};

/**
 * Testing whether an expression evaluates to a value of a certain enum variant.
 */
export function IsVariant({ variant, children }: IsVariantProps): Expression {
  return (
    <>
      <exps x={children} /> <Keyword2>is</Keyword2> <exps x={variant} />
    </>
  );
}

export type FunctionLiteralUntypedProps = {
  /**
   * The sequence of argument names (name first, unique id second).
   */
  args: MaybeCommented<[string, string]>[];
  /**
   * Whether to render the argument types one type per line.
   */
  multilineArgs?: boolean;
  /**
   * The function body.
   */
  body: MaybeCommented<Expressions>[];
  /**
   * Whether the body should be inline instead of an indented block.
   */
  singleLineBody?: boolean;
};

/**
 * A function literal (aka anonymous function, lambda expression, closure) without type annotations.
 */
export function FunctionLiteralUntyped(
  { args, multilineArgs, body, singleLineBody }: FunctionLiteralUntypedProps,
): Expression {
  return (
    <>
      <Delimited
        delims={["(", ")"]}
        content={mapMaybeCommented(
          args,
          ([id, n]) => <RenderFreshValue id={[id, n]} />,
        )}
        multiline={multilineArgs}
        separator=","
      />
      {` `}
      <Deemph>{`->`}</Deemph>
      {` `}
      <Delimited
        delims={["{", "}"]}
        content={body}
        multiline={!singleLineBody}
      />
    </>
  );
}

export type FunctionLiteralProps = {
  /**
   * Generic type arguments.
   */
  generics?: MaybeCommented<TypeArgument>[];
  /**
   * Whether to render each type argument in its own line.
   */
  multilineGenerics?: boolean;
  /**
   * The sequence of argument names (name first, unique id second).
   */
  args: MaybeCommented<[string, string, Expression]>[];
  /**
   * Whether to render the argument types one type per line.
   */
  multilineArgs?: boolean;
  /**
   * The return type.
   */
  ret?: Expressions;
  /**
   * The function body.
   */
  body: Expressions[];
  /**
   * Whether the body should be inline instead of an indented block.
   */
  singleLineBody?: boolean;
};

/**
 * A function literal (aka anonymous function, lambda expression, closure) with type annotations.
 */
export function FunctionLiteral(
  {
    generics,
    multilineGenerics,
    args,
    multilineArgs,
    body,
    singleLineBody,
    ret,
  }: FunctionLiteralProps,
): Expression {
  return (
    <>
      <RenderTypeArguments args={generics} multiline={multilineGenerics} />
      <Delimited
        delims={["(", ")"]}
        content={mapMaybeCommented(
          args,
          ([id, n, ty]) => {
            return (
              <TypeAnnotation
                type={ty}
              >
                <RenderFreshValue id={[id, n]} />
              </TypeAnnotation>
            );
          },
        )}
        multiline={multilineArgs}
        separator=","
      />
      {` `}
      <Deemph>{`->`}</Deemph>
      {` `}
      {ret === undefined ? "" : (
        <>
          <exps x={ret} />
          {" "}
        </>
      )}
      <Delimited
        delims={["{", "}"]}
        content={body}
        multiline={!singleLineBody}
      />
    </>
  );
}

export type ApplicationRawProps = {
  /**
   * Function to call.
   */
  fun: Expressions;
  /**
   * Optional generics.
   */
  generics?: MaybeCommented<Expression>[];
  /**
   * Whether to render the generics one type per line.
   */
  multilineGenerics?: boolean;
  /**
   * The argument expressions
   */
  args?: MaybeCommented<Expression>[];
  /**
   * Whether to render the arguments one expression per line.
   */
  multilineArgs?: boolean;
};

/**
 * A type application for an arbitrary type constructor expression.
 */
export function ApplicationRaw(
  { fun, generics, multilineGenerics, args = [], multilineArgs }:
    ApplicationRawProps,
): Expression {
  return (
    <>
      <exps x={fun} />
      {generics === undefined ? "" : (
        <Delimited
          delims={[
            <EscapeHtml>{"<"}</EscapeHtml>,
            <EscapeHtml>{">"}</EscapeHtml>,
          ]}
          content={generics}
          multiline={multilineGenerics}
          separator=","
        />
      )}
      <Delimited
        delims={["(", ")"]}
        content={args}
        multiline={multilineArgs}
        separator=","
      />
    </>
  );
}

export type ApplicationProps = {
  /**
   * DefRef id of the function to call.
   */
  fun: string;
  /**
   * Optional generics.
   */
  generics?: MaybeCommented<Expression>[];
  /**
   * Whether to render the generics one type per line.
   */
  multilineGenerics?: boolean;
  /**
   * The argument expressions
   */
  args?: MaybeCommented<Expression>[];
  /**
   * Whether to render the arguments one expression per line.
   */
  multilineArgs?: boolean;
};

export function Application(
  { fun, generics, multilineGenerics, args = [], multilineArgs }:
    ApplicationProps,
): Expression {
  return ApplicationRaw({
    fun: <R n={fun} />,
    generics,
    multilineGenerics,
    args,
    multilineArgs,
  });
}

export type ArrayLiteralProps = {
  /**
   * Whether to give each field its on line of code.
   */
  multiline?: boolean;
  /**
   * The field expressions.
   */
  fields?: MaybeCommented<Expressions>[];
};

/**
 * An array literal, listing all values explicitly.
 */
export function ArrayLiteral(
  { fields = [], multiline }: ArrayLiteralProps,
): Expression {
  return (
    <Delimited
      delims={["[", "]"]}
      content={fields}
      multiline={multiline}
      separator=","
    />
  );
}

export type ArrayRepeatedProps = {
  /**
   * The expression to repeat.
   */
  children: Expressions;
  /**
   * The number of repititions
   */
  repetitions: Expressions;
};

/**
 * An array literal, listing all values explicitly.
 */
export function ArrayRepeated(
  { children, repetitions }: ArrayRepeatedProps,
): Expression {
  return (
    <Delimiters delims={["[", "]"]}>
      <exps x={children} />
      <Deemph>;</Deemph> <exps x={repetitions} />
    </Delimiters>
  );
}

export type IndexProps = {
  /**
   * The expression to access.
   */
  children: Expressions;
  /**
   * Where to index.
   */
  index: Expressions;
};

/**
 * Index into an array or slice.
 */
export function Index(
  { children, index }: IndexProps,
): Expression {
  return (
    <>
      <exps x={children} />
      <Delimiters delims={["[", "]"]}>
        <exps x={index} />
      </Delimiters>
    </>
  );
}

export type PointerProps = {
  /**
   * The expression of which to take a reference.
   */
  children: Expressions;
  /**
   * Whether the reference allows mutation, or is writeonly, or full opaque.
   */
  mut?: boolean | "writeonly" | "opaque";
};

/**
 * Take a reference to a value.
 */
export function Pointer(
  { children, mut }: PointerProps,
): Expression {
  const kw: Expression = mut
    ? (typeof mut === "boolean" ? <Mut /> : <Keyword2>{mut}</Keyword2>)
    : "";
  return (
    <>
      <Deemph>&</Deemph>
      {kw}
      {kw === "" ? "" : " "}
      <exps x={children} />
    </>
  );
}

/**
 * Dereference a value.
 */
export function Deref(
  { children }: { children: Expressions },
): Expression {
  return (
    <>
      <Deemph>*</Deemph>
      <exps x={children} />
    </>
  );
}

export type RangeProps = {
  /**
   * Where should the slice begin?
   */
  from?: Expressions;
  /**
   * Where should the slice end?
   */
  to?: Expressions;
  /**
   * Is the end inclusive?
   */
  inclusive?: boolean;
};

/**
 * An iterator that produces a range of values.
 */
export function RangeLiteral(
  { from = "", to = "", inclusive }: RangeProps,
): Expression {
  return (
    <>
      <exps x={from} />
      <Deemph>..{inclusive ? "=" : ""}</Deemph>
      <exps x={to} />
    </>
  );
}

export type SliceProps = {
  /**
   * The expression of which to take a slice.
   */
  children: Expressions;
  /**
   * Whether the reference allows mutation, or is writeonly, or full opaque.
   */
  mut?: boolean | "writeonly" | "opaque";
} & RangeProps;

/**
 * Take a reference to a value.
 */
export function Slice(
  { children, mut, from = "", to = "", inclusive }: SliceProps,
): Expression {
  const kw: Expression = mut
    ? (typeof mut === "boolean" ? <Mut /> : <Keyword2>{mut}</Keyword2>)
    : "";
  return (
    <>
      <Deemph>&</Deemph>
      {kw}
      {kw === "" ? "" : " "}
      <exps x={children} />
      <Delimiters delims={["[", "]"]}>
        <RangeLiteral from={from} to={to} inclusive={inclusive} />
      </Delimiters>
    </>
  );
}

/**
 * Render a `mut` keyword.
 */
export function Mut(): Expression {
  return <Keyword2>mut</Keyword2>;
}

/**
 * Render the assignment operator `:=`.
 */
export function AssignmentOp(): Expression {
  return <Deemph>:=</Deemph>;
}

export type LetRawProps = {
  /**
   * The left side of the definition.
   */
  lhs: Expressions;
  /**
   * Whether to prefix the lhs with a `mut` keyword.
   */
  mut?: boolean;
  /**
   * An optional type annotation.
   */
  type?: Expressions;
  /**
   * The right side of the definition.
   */
  children: Expressions;
};

/**
 * Create a local variable.
 */
export function LetRaw(
  { children, mut, lhs, type }: LetRawProps,
): Expression {
  return (
    <>
      <Keyword>let</Keyword>
      {mut
        ? (
          <>
            {" "}
            <Mut />
          </>
        )
        : ""}{" "}
      {type === undefined ? <exps x={lhs} /> : (
        <TypeAnnotation type={type}>
          <exps x={lhs} />
        </TypeAnnotation>
      )} <AssignmentOp /> <exps x={children} />
    </>
  );
}

export type LetProps = {
  /**
   * The identifier to use as the left-hand side of the definition.
   */
  id: FreshId;
  /**
   * Whether to prefix the id with a `mut` keyword.
   */
  mut?: boolean;
  /**
   * An optional type annotation.
   */
  type?: Expressions;
  /**
   * The right side of the definition.
   */
  children: Expressions;
};

/**
 * Create a local variable.
 */
export function Let(
  { children, mut, id, type }: LetProps,
): Expression {
  return (
    <LetRaw mut={mut} lhs={<RenderFreshValue id={id} />} type={type}>
      <exps x={children} />
    </LetRaw>
  );
}

export type AssignRawProps = {
  /**
   * The left side of the assignment.
   */
  lhs: Expressions;
  /**
   * An optional assignment operator to replace the default `:=` one.
   */
  op?: Expressions;
  /**
   * The right side of the assignment.
   */
  children: Expressions;
};

/**
 * Assign to a variable.
 */
export function AssignRaw(
  { children, lhs, op }: AssignRawProps,
): Expression {
  return (
    <>
      <exps x={lhs} /> {op === undefined ? <AssignmentOp /> : (
        <Deemph>
          <exps x={op} />
        </Deemph>
      )} <exps x={children} />
    </>
  );
}

export type AssignProps = {
  /**
   * The DefRef id of the left-hand side of the assignment.
   */
  id: string;
  /**
   * An optional assignment operator to replace the default `:=` one.
   */
  op?: Expressions;
  /**
   * The right side of the definition.
   */
  children: Expressions;
};

/**
 * Assign to a variable, identified by its DefRef id.
 */
export function Assign(
  { children, id, op }: AssignProps,
): Expression {
  return (
    <AssignRaw lhs={<R n={id} />} op={op}>
      <exps x={children} />
    </AssignRaw>
  );
}

export type IfProps = {
  /**
   * The condition.
   */
  cond: Expressions;
  /**
   * Whether to not render the body one line per expression.
   */
  singleline?: boolean;
  /**
   * The body (run if the condition is true).
   */
  body?: MaybeCommented<Expressions>[];
};

/**
 * An `if` statement.
 */
export function If({ cond, singleline, body }: IfProps): Expression {
  return (
    <>
      <Keyword>if</Keyword> <exps x={cond} />{" "}
      <Delimited
        multiline={!singleline}
        delims={["{", "}"]}
        content={body ?? []}
      />
    </>
  );
}

export type ElseProps = {
  /**
   * Whether to not render the body one line per expression.
   */
  singleline?: boolean;
  /**
   * The body.
   */
  body?: MaybeCommented<Expressions>[];
};

/**
 * An `else` statement (you probably want to place this after an `If` macro).
 */
export function Else({ singleline, body }: ElseProps): Expression {
  return (
    <>
      <Keyword>else</Keyword>{" "}
      <Delimited
        multiline={!singleline}
        delims={["{", "}"]}
        content={body ?? []}
      />
    </>
  );
}

export type ElseIfProps = {
  /**
   * The condition.
   */
  cond: Expressions;
  /**
   * Whether to not render the body one line per expression.
   */
  singleline?: boolean;
  /**
   * The body.
   */
  body?: MaybeCommented<Expressions>[];
};

/**
 * An `else` statement (you probably want to place this after an `If` macro).
 */
export function ElseIf({ singleline, cond, body }: ElseIfProps): Expression {
  return (
    <>
      <Keyword>else</Keyword> <Keyword>if</Keyword> <exps x={cond} />{" "}
      <Delimited
        multiline={!singleline}
        delims={["{", "}"]}
        content={body ?? []}
      />
    </>
  );
}

export type MatchProps = {
  /**
   * The expression to match on.
   */
  exp: Expressions;
  /**
   * The cases. The first pair member is the pattern, the second is the corresponding body - rendered as a block if it is an array.
   */
  cases: MaybeCommented<[Expressions, (Expression | MaybeCommented<Expressions>[])]>[];
};

/**
 * A `match` statement.
 */
export function Match({ exp, cases }: MatchProps): Expression {
  return (
    <>
      <Keyword>match</Keyword> <exps x={exp} />{" "}
      <Delimited
        multiline
        delims={["{", "}"]}
        content={mapMaybeCommented(cases, ([theCase, body]) => {
          return (
            <>
              <exps x={theCase} /> <Deemph>{"=>"}</Deemph> {Array.isArray(body)
                ? (
                  <Delimited
                    multiline
                    delims={["{", "}"]}
                    content={body}
                  />
                )
                : <exps x={body} />}
            </>
          );
        })}
      />
    </>
  );
}

/**
 * The blank pattern that matches everything.
 */
export function BlankPattern(): Expression {
  return <Deemph>_</Deemph>;
}

/**
 * A `return` statement.
 */
export function Return({ children }: { children?: Expression }): Expression {
  return (
    <>
      <Keyword>return</Keyword>
      {children === undefined ? "" : (
        <>
          {" "}
          <exps x={children} />
        </>
      )}
    </>
  );
}

/**
 * A `return` statement.
 */
export function Break({ children }: { children?: Expression }): Expression {
  return (
    <>
      <Keyword>break</Keyword>
      {children === undefined ? "" : (
        <>
          {" "}
          <exps x={children} />
        </>
      )}
    </>
  );
}

export type WhileProps = {
  /**
   * The condition.
   */
  cond: Expressions;
  /**
   * Whether to not render the body one line per expression.
   */
  singleline?: boolean;
  /**
   * The body (run while the condition is true).
   */
  body?: MaybeCommented<Expressions>[];
};

/**
 * A `while` loop.
 */
export function While({ cond, singleline, body }: WhileProps): Expression {
  return (
    <>
      <Keyword>while</Keyword> <exps x={cond} />{" "}
      <Delimited
        multiline={!singleline}
        delims={["{", "}"]}
        content={body ?? []}
      />
    </>
  );
}

export type LoopProps = {
  /**
   * Whether to not render the body one line per expression.
   */
  singleline?: boolean;
  /**
   * The body (run while the condition is true).
   */
  body?: MaybeCommented<Expressions>[];
};

/**
 * A loop statement (equivalent to `while true`).
 */
export function Loop({ singleline, body }: LoopProps): Expression {
  return (
    <>
      <Keyword>loop</Keyword>{" "}
      <Delimited
        multiline={!singleline}
        delims={["{", "}"]}
        content={body ?? []}
      />
    </>
  );
}

export type ForRawProps = {
  /**
   * The pattern for the element for the current iteration.
   */
  pattern: Expressions;
  /**
   * Whether to prefix the pattern by the `mu` keyword.
   */
  mut?: boolean;
  /**
   * The iterator to consume with the loop.
   */
  iterator: Expressions;
  /**
   * Whether to not render the body one line per expression.
   */
  singleline?: boolean;
  /**
   * The body (run once for each value of the iterator).
   */
  body?: MaybeCommented<Expressions>[];
};

/**
 * A `for` loop.
 */
export function ForRaw(
  { pattern, mut, iterator, singleline, body }: ForRawProps,
): Expression {
  return (
    <>
      <Keyword>for</Keyword> {mut
        ? (
          <>
            <Mut />
            {" "}
          </>
        )
        : ""}
      <exps x={pattern} /> <Keyword>in</Keyword> <exps x={iterator} />{" "}
      <Delimited
        multiline={!singleline}
        delims={["{", "}"]}
        content={body ?? []}
      />
    </>
  );
}

export type ForProps = {
  /**
   * The pattern for the element for the current iteration.
   */
  pattern: FreshId;
  /**
   * Whether to prefix the pattern by the `mu` keyword.
   */
  mut?: boolean;
  /**
   * The iterator to consume with the loop.
   */
  iterator: Expressions;
  /**
   * Whether to not render the body one line per expression.
   */
  singleline?: boolean;
  /**
   * The body (run once for each value of the iterator).
   */
  body?: MaybeCommented<Expressions>[];
};

/**
 * A `for` loop, creating a fresh id as the pattern.
 */
export function For(
  { pattern, mut, iterator, singleline, body }: ForProps,
): Expression {
  return (
    <ForRaw
      pattern={<RenderFreshValue id={pattern} />}
      mut={mut}
      iterator={iterator}
      singleline={singleline}
      body={body}
    />
  );
}

/**
 * A type argument: a type variable identifier, together with optional interfaces that the instantiating types must implement.
 */
export type TypeArgument = {
  /**
   * The id to use for the type variable.
   */
  id: FreshId;
  /**
   * Interfaces it must implement.
   */
  bounds?: MaybeCommented<Expressions>[];
  /**
   * Whether to render each bound on its own line.
   */
  multiline?: boolean;
};

export function RenderTypeArgument(
  { ty, fake }: { ty: TypeArgument; fake?: boolean },
): Expression {
  const { id, bounds = [], multiline } = ty;

  return (
    <>
      <RenderFreshTypeArg id={id} fake={fake} />
      {bounds.length === 0 ? "" : (
        <>
          <Deemph>:</Deemph>{" "}
          <Delimited
            delims={["", ""]}
            separator=" +"
            multiline={multiline}
            content={bounds}
          />
        </>
      )}
    </>
  );
}

export function RenderTypeArguments(
  { args = [], multiline, fake }: {
    args?: MaybeCommented<TypeArgument>[];
    multiline?: boolean;
    fake?: boolean; // Pass the fake prop to the Def macro.
  },
): Expression {
  return (
    <>
      {args.length === 0 ? "" : (
        <Delimited
          multiline={multiline}
          delims={[
            <EscapeHtml>{"<"}</EscapeHtml>,
            <EscapeHtml>{">"}</EscapeHtml>,
          ]}
          content={mapMaybeCommented(
            args,
            (arg) => <RenderTypeArgument ty={arg} fake={fake} />,
          )}
          separator=","
        />
      )}
    </>
  );
}

/**
 * Like a normal `<PreviewScope>`, but adds state.previewAnnotation at the end of all the previews it creates.
 */
function AnnotatedPreviewScope(
  { children, dedent, loc }: {
    children?: Expressions;
    dedent?: number;
    loc?: boolean;
  },
): Expression {
  return (
    <PreviewScopePushWrapper
      wrapper={(ctx, p) => {
        const state = getState(ctx);
        const clazz = ["pseudocode"];
        if (dedent !== undefined && dedent > 0) {
          clazz.push(`dedent${dedent}`);
        }
        let annotatedP: Expression = (
          <Code clazz={clazz}>{loc ? <Loc>{p}</Loc> : p}</Code>
        );

        if (state.previewAnnotation !== null) {
          annotatedP = (
            <>
              {annotatedP}
              <Div clazz="previewAnnotation">
                <exps x={state.previewAnnotation} />
              </Div>
            </>
          );
        }

        return annotatedP;
      }}
    >
      <PreviewScope>
        <exps x={children} />
      </PreviewScope>
    </PreviewScopePushWrapper>
  );
}

/**
 * Set state.previewAnnotation while evaluating the children, reset it afterwards.
 */
function SetPreviewAnnotation(
  { children, annotation }: {
    children?: Expressions;
    annotation?: Expressions | null; // null clears it
  },
): Expression {
  let previousPreview: Expressions | null = null;
  return (
    <lifecycle
      pre={(ctx) => {
        const state = getState(ctx);
        previousPreview = state.previewAnnotation;
        state.previewAnnotation = annotation === undefined ? null : annotation;
      }}
      post={(ctx) => {
        const state = getState(ctx);
        state.previewAnnotation = previousPreview;
      }}
    >
      <exps x={children} />
    </lifecycle>
  );
}

type ItemProps = {
  /**
   * The identifier of the item.
   */
  id: FreshId;
  /**
   * A doc comment for the item as a whole.
   */
  comment?: Expressions;
  /**
   * Generic arguments.
   */
  generics?: MaybeCommented<TypeArgument>[];
  /**
   * Whether to render each type argument in its own line.
   */
  multilineGenerics?: boolean;
  /**
   * The keyword to introduce the item.
   */
  kw?: Expressions;
  /**
   * The macro to use to render the fresh item identifier.
   */
  idRenderer: (props: { id: FreshId }) => Expression;
  /**
   * Preview annotation to set for all defs inside the item.
   */
  previewAnnotation?: Expressions | null;
  /**
   * Optionally map the rendered id.
   */
  mapId?: (ctx: Context, exp: Expression) => Expression;
  /**
   * Anything that comes after the space after the item id (and the generics, if any).
   */
  children?: Expressions;
  /**
   * Do not wrap the item in an Loc macro.
   */
  noLoc?: boolean;
  /**
   * How far to dedent the preview scope created by this item.
   */
  dedent?: number;
  /**
   * Do not createa  preview scope for this item.
   */
  noPreviewScope?: boolean;
};

function Item(
  {
    id,
    generics = [],
    multilineGenerics,
    comment,
    kw,
    mapId,
    idRenderer,
    previewAnnotation,
    children,
    noLoc,
    dedent,
    noPreviewScope,
  }: ItemProps,
): Expression {
  const setPreviewAnnotation = (children: Expressions) => {
    if (previewAnnotation === undefined) {
      return <exps x={children} />;
    } else {
      return (
        <SetPreviewAnnotation
          annotation={previewAnnotation}
        >
          <exps x={children} />
        </SetPreviewAnnotation>
      );
    }
  };

  const wrapWithLoc = (exp: Expression) => <>{noLoc ? exp : <Loc>{exp}</Loc>}
  </>;
  const wrapWithPreviewScope = (exp: Expression) =>
    noPreviewScope ? exp : (
      <AnnotatedPreviewScope loc={!!noLoc} dedent={dedent}>
        {exp}
      </AnnotatedPreviewScope>
    );

  return (
    <impure
      fun={(ctx) => {
        return wrapWithPreviewScope(
          <>
            {comment === undefined ? "" : (
              <CommentLine>
                <exps x={comment} />
              </CommentLine>
            )}
            {wrapWithLoc(
              <>
                {kw === undefined ? "" : (
                  <>
                    <Keyword2>
                      <exps x={kw} />
                    </Keyword2>
                    {" "}
                  </>
                )}
                {mapId === undefined
                  ? idRenderer({ id })
                  : mapId(ctx, idRenderer({ id }))}
                <RenderTypeArguments
                  args={generics}
                  multiline={multilineGenerics}
                />
                {setPreviewAnnotation(children)}
              </>,
            )}
          </>,
        );
      }}
    />
  );
}

export type TypeProps = {
  /**
   * The identifier to define.
   */
  id: FreshId;
  /**
   * Generic arguments.
   */
  generics?: MaybeCommented<TypeArgument>[];
  /**
   * Whether to render each type argument in its own line.
   */
  multiline?: boolean;
  /**
   * A doc comment for the type definition as a whole.
   */
  comment?: Expressions;
  /**
   * What to bind to the identifier.
   */
  children: Expressions;
};

/**
 * A type definition.
 */
export function Type(
  { id, comment, generics, multiline, children }: TypeProps,
): Expression {
  return (
    <Item
      id={id}
      generics={generics}
      multilineGenerics={multiline}
      comment={comment}
      kw="type"
      idRenderer={RenderFreshType}
    >
      {" "}
      <AssignmentOp /> <exps x={children} />
    </Item>
  );
}

export type LetItemProps = {
  /**
   * The identifier to use as the left-hand side of the definition.
   */
  id: FreshId;
  /**
   * Whether to prefix the id with a `mut` keyword.
   */
  mut?: boolean;
  /**
   * An optional type annotation.
   */
  type?: Expressions;
  /**
   * A doc comment for the item as a whole.
   */
  comment?: Expressions;
  /**
   * The right side of the definition.
   */
  children: Expressions;
};

/**
 * Create a global variable.
 */
export function LetItem(
  { children, mut, id, type, comment }: LetItemProps,
): Expression {
  return (
    <Item
      id={id}
      comment={comment}
      kw="let"
      idRenderer={RenderFreshValue}
      mapId={(ctx, exp) => {
        return (
          <>
            {mut
              ? (
                <>
                  <Mut />
                  {" "}
                </>
              )
              : ""}
            {type === undefined ? exp : (
              <TypeAnnotation type={type}>
                {exp}
              </TypeAnnotation>
            )}
          </>
        );
      }}
    >
      {" "}
      <AssignmentOp /> <exps x={children} />
    </Item>
  );
}

export type FunctionItemUntypedProps = {
  /**
   * The identifier to use as the function name.
   */
  id: FreshId;
  /**
   * A doc comment for the function.
   */
  comment?: Expressions;
} & FunctionLiteralUntypedProps;

/**
 * Create a global function without type information.
 */
export function FunctionItemUntyped(
  props: FunctionItemUntypedProps,
): Expression {
  const { id, comment } = props;
  return (
    <Item
      id={id}
      comment={comment}
      kw="fn"
      idRenderer={RenderFreshFunction}
    >
      {FunctionLiteralUntyped(props)}
    </Item>
  );
}

export type FunctionItemProps = {
  /**
   * The identifier to use as the function name.
   */
  id: FreshId;
  /**
   * A doc comment for the function.
   */
  comment?: Expressions;
} & FunctionLiteralProps;

/**
 * Create a global function with type information.
 */
export function FunctionItem(
  props: FunctionItemProps,
): Expression {
  const { id, comment } = props;
  return (
    <Item
      id={id}
      comment={comment}
      kw="fn"
      idRenderer={RenderFreshFunction}
    >
      {FunctionLiteral(props)}
    </Item>
  );
}

export type StructDefProps = {
  /**
   * The identifier of the struct type.
   */
  id: FreshId;
  /**
   * Generic arguments.
   */
  generics?: MaybeCommented<TypeArgument>[];
  /**
   * Whether to render each type argument in its own line.
   */
  multilineGenerics?: boolean;
  /**
   * A doc comment for the struct as a whole.
   */
  comment?: Expressions;
  /**
   * The fields. Identifier first, type second.
   */
  fields: MaybeCommented<[FreshId, Expressions]>[];
};

/**
 * A struct definition.
 */
export function StructDef(
  { id, generics, multilineGenerics, comment, fields }: StructDefProps,
): Expression {
  return (
    <Item
      id={id}
      generics={generics}
      multilineGenerics={multilineGenerics}
      comment={comment}
      kw="struct"
      idRenderer={RenderFreshType}
      previewAnnotation={
        <>
          Field of <R n={freshIdN(id)} />
        </>
      }
    >
      {" "}
      <Delimited
        multiline
        delims={["{", "}"]}
        separator=","
        content={mapMaybeCommented(fields, ([fieldId, fieldType]) => {
          return (
            <>
              <RenderFreshField id={fieldId} />
              <Deemph>:</Deemph> <exps x={fieldType} />
            </>
          );
        })}
        mapContentIndividual={(_ctx, c) => {
          return (
            <PreviewScopePopWrapper>
              <AnnotatedPreviewScope dedent={1}>
                <exps x={c} />
              </AnnotatedPreviewScope>
            </PreviewScopePopWrapper>
          );
        }}
      />
    </Item>
  );
}

export type TupleStructDefProps = {
  /**
   * The identifier of the struct type.
   */
  id: FreshId;
  /**
   * Generic arguments.
   */
  generics?: MaybeCommented<TypeArgument>[];
  /**
   * Whether to render each type argument in its own line.
   */
  multilineGenerics?: boolean;
  /**
   * A doc comment for the struct as a whole.
   */
  comment?: Expressions;
  /**
   * Whether to render each field in its own line.
   */
  multilineFields?: boolean;
  /**
   * The field types.
   */
  fields?: MaybeCommented<Expression>[];
};

/**
 * A struct definition.
 */
export function TupleStructDef(
  { id, generics, multilineGenerics, comment, multilineFields, fields = [] }:
    TupleStructDefProps,
): Expression {
  return (
    <Item
      id={id}
      generics={generics}
      multilineGenerics={multilineGenerics}
      comment={comment}
      kw="struct"
      idRenderer={RenderFreshType}
      previewAnnotation={
        <>
          Field of <R n={freshIdN(id)} />
        </>
      }
    >
      {fields.length === 0 ? "" : (
        <Delimited
          multiline={multilineFields}
          delims={["(", ")"]}
          separator=","
          content={fields}
        />
      )}
    </Item>
  );
}

export type EnumProps = {
  /**
   * The identifier of the enum type.
   */
  id: FreshId;
  /**
   * Generic arguments.
   */
  generics?: MaybeCommented<TypeArgument>[];
  /**
   * Whether to render each type argument in its own line.
   */
  multilineGenerics?: boolean;
  /**
   * A doc comment for the enum as a whole.
   */
  comment?: Expressions;
  /**
   * The fields.
   */
  variants: (EnumVariantStruct | EnumVariantTupleStruct)[];
};

export type EnumVariantStruct = {
  /**
   * The identifier of the variant.
   */
  id: FreshId;
  /**
   * A doc comment for the struct as a whole.
   */
  comment?: Expressions;
  /**
   * The fields. Identifier first, type second.
   */
  fields: MaybeCommented<[FreshId, Expressions]>[];
};

export type EnumVariantTupleStruct = {
  /**
   * Marker to distinguish from non-tuple variants.
   */
  tuple: true;
  /**
   * The identifier of the variant.
   */
  id: FreshId;
  /**
   * A doc comment for the struct as a whole.
   */
  comment?: Expressions;
  /**
   * Whether to render each field in its own line.
   */
  multilineFields?: boolean;
  /**
   * The field types.
   */
  fields?: MaybeCommented<Expression>[];
};

/**
 * An enum definition.
 */
export function Enum(
  { id, generics, multilineGenerics, comment, variants }: EnumProps,
): Expression {
  return (
    <Item
      id={id}
      generics={generics}
      multilineGenerics={multilineGenerics}
      comment={comment}
      kw="enum"
      idRenderer={RenderFreshType}
      previewAnnotation={
        <>
          Variant of <R n={freshIdN(id)} />
        </>
      }
    >
      {" "}
      <Delimited
        multiline
        delims={["{", "}"]}
        content={variants.map((variant) => {
          const comment = variant.comment;

          if ("tuple" in variant) {
            const fields = variant.fields ?? [];
            const innerId = variant.id;

            const innerItem = (
              <PreviewScopePopWrapper>
                <Item
                  noLoc
                  noPreviewScope
                  id={innerId}
                  idRenderer={RenderFreshVariant}
                  dedent={1}
                >
                  {fields.length === 0 ? "" : (
                    <>
                      <Delimited
                        multiline={variant.multilineFields}
                        delims={["(", ")"]}
                        content={fields}
                        separator=","
                        mapContentIndividual={(_ctx, c) => {
                          return (
                            <PreviewScopePopWrapper>
                              <AnnotatedPreviewScope dedent={2}>
                                <exps x={c} />
                              </AnnotatedPreviewScope>
                            </PreviewScopePopWrapper>
                          );
                        }}
                      />
                    </>
                  )}
                </Item>
              </PreviewScopePopWrapper>
            );

            if (comment === undefined) {
              return innerItem;
            } else {
              return {
                commented: {
                  segment: innerItem,
                  comment,
                  dedicatedLine: true,
                },
              };
            }
          } else {
            const fields = variant.fields;
            const innerId = variant.id;

            const innerItem = (
              <PreviewScopePopWrapper>
                <Item
                  noLoc
                  noPreviewScope
                  id={innerId}
                  idRenderer={RenderFreshVariant}
                  previewAnnotation={
                    <>
                      Field of{" "}
                      <Code>
                        <R n={freshIdN(id)} />
                        <Deemph>::</Deemph>
                        <R n={freshIdN(innerId)} />
                      </Code>
                    </>
                  }
                  dedent={1}
                >
                  {" "}
                  <Delimited
                    multiline
                    delims={["{", "}"]}
                    separator=","
                    content={mapMaybeCommented(
                      fields,
                      ([fieldId, fieldType]) => {
                        return (
                          <>
                            <RenderFreshField id={fieldId} />
                            <Deemph>:</Deemph> <exps x={fieldType} />
                          </>
                        );
                      },
                    )}
                    mapContentIndividual={(_ctx, c) => {
                      return (
                        <PreviewScopePopWrapper>
                          <AnnotatedPreviewScope dedent={2}>
                            <exps x={c} />
                          </AnnotatedPreviewScope>
                        </PreviewScopePopWrapper>
                      );
                    }}
                  />
                </Item>
              </PreviewScopePopWrapper>
            );

            if (comment === undefined) {
              return innerItem;
            } else {
              return {
                commented: {
                  segment: innerItem,
                  comment,
                  dedicatedLine: true,
                },
              };
            }
          }
        })}
        mapContentIndividual={(_ctx, c) => {
          return (
            <PreviewScopePopWrapper>
              <AnnotatedPreviewScope dedent={1}>
                <exps x={c} />
              </AnnotatedPreviewScope>
            </PreviewScopePopWrapper>
          );
        }}
      />
    </Item>
  );
}

export type InterfaceProps = {
  /**
   * The identifier of the interface.
   */
  id: FreshId;
  /**
   * Generic arguments.
   */
  generics?: MaybeCommented<TypeArgument>[];
  /**
   * Whether to render each type argument in its own line.
   */
  multilineGenerics?: boolean;
  /**
   * A doc comment for the interface as a whole.
   */
  comment?: Expressions;
  /**
   * The fields. Identifier first, type second.
   */
  members: (LetInterfaceProps | FunctionInterfaceProps)[];
};

export type LetInterfaceProps = {
  /**
   * The identifier to use as the left-hand side of the definition.
   */
  id: FreshId;
  /**
   * The type annotation.
   */
  type: Expressions;
  /**
   * A doc comment for the item as a whole.
   */
  comment?: Expressions;
  /**
   * Marker.
   */
  let: true;
};

export type FunctionInterfaceProps = {
  /**
   * The identifier to use as the function name.
   */
  id: FreshId;
  /**
   * A doc comment for the function.
   */
  comment?: Expressions;
} & FunctionTypeNamedProps;

/**
 * An interface definition.
 */
export function Interface(
  { id, generics, multilineGenerics, comment, members }: InterfaceProps,
): Expression {
  return (
    <Item
      id={id}
      generics={generics}
      multilineGenerics={multilineGenerics}
      comment={comment}
      kw="interface"
      idRenderer={RenderFreshInterface}
      previewAnnotation={
        <>
          Member of <R n={freshIdN(id)} />
        </>
      }
    >
      {" "}
      <Delimited
        multiline="emptyLines"
        delims={["{", "}"]}
        content={members.map((member) => {
          const comment = member.comment;

          if ("let" in member) {
            // Member is LetInterfaceProps.
            const innerId = member.id;

            const innerItem = (
              <PreviewScopePopWrapper>
                <Item
                  noLoc
                  noPreviewScope
                  id={innerId}
                  kw="let"
                  idRenderer={RenderFreshValue}
                  mapId={(ctx, exp) => {
                    return (
                      <TypeAnnotation type={member.type}>
                        {exp}
                      </TypeAnnotation>
                    );
                  }}
                />
              </PreviewScopePopWrapper>
            );

            if (comment === undefined) {
              return innerItem;
            } else {
              return {
                commented: {
                  segment: innerItem,
                  comment,
                  dedicatedLine: true,
                },
              };
            }
          } else {
            const innerId = member.id;

            const innerItem = (
              <PreviewScopePopWrapper>
                <Item
                  noLoc
                  noPreviewScope
                  id={innerId}
                  idRenderer={RenderFreshFunction}
                  previewAnnotation={null}
                  dedent={1}
                >
                  <FunctionTypeNamed
                    args={member.args}
                    ret={member.ret}
                    multiline={member.multiline}
                    generics={member.generics}
                    multilineGenerics={member.multilineGenerics}
                  />
                </Item>
              </PreviewScopePopWrapper>
            );

            if (comment === undefined) {
              return innerItem;
            } else {
              return {
                commented: {
                  segment: innerItem,
                  comment,
                  dedicatedLine: true,
                },
              };
            }
          }
        })}
        mapContentIndividual={(_ctx, c) => {
          return (
            <PreviewScopePopWrapper>
              <AnnotatedPreviewScope dedent={1}>
                <exps x={c} />
              </AnnotatedPreviewScope>
            </PreviewScopePopWrapper>
          );
        }}
      />
    </Item>
  );
}

/**
 * The `Self` keyword to use in interface definitions.
 */
export function Self(): Expression {
  return <Keyword>Self</Keyword>;
}

export type ImplProps = {
  /**
   * A doc comment for the item as a whole.
   */
  comment?: Expressions;
  /**
   * Generic arguments.
   */
  generics?: MaybeCommented<TypeArgument>[];
  /**
   * Whether to render each type argument in its own line.
   */
  multilineGenerics?: boolean;
  /**
   * The DefRef id of the interface being implemented.
   */
  iface: Expressions;
  /**
   * The DefRef id of the type that implements the interface.
   */
  type: Expressions;
  /**
   * Implementations of the members.
   */
  members?: ((LetItemProps & { let: true }) | FunctionItemProps)[];
};

/**
 * Implement an interface for a type.
 */
export function Impl(
  {
    comment,
    generics = [],
    multilineGenerics,
    iface,
    type,
    members = [],
  }: ImplProps,
): Expression {
  return (
    <AnnotatedPreviewScope loc>
      {comment === undefined ? "" : (
        <CommentLine>
          <exps x={comment} />
        </CommentLine>
      )}
      <Loc>
        <Keyword2>impl</Keyword2>
        <RenderTypeArguments
          args={generics}
          multiline={multilineGenerics}
        />{" "}
        <exps x={iface} /> <Keyword2>for</Keyword2> <exps x={type} />{" "}
        <SetPreviewAnnotation
          annotation={
            <>
              <Div>Member implementation of:</Div>
              <FakePseudocode>
                <Code clazz="pseudocode noLineNumbers dedent1">
                  <Loc>
                    <Keyword2>impl</Keyword2>
                    <RenderTypeArguments
                      args={generics}
                      multiline={multilineGenerics}
                      fake
                    />{" "}
                    <exps x={iface} /> <Keyword2>for</Keyword2>{" "}
                    <exps x={type} />
                  </Loc>
                </Code>
              </FakePseudocode>
            </>
          }
        >
          <Delimited
            multiline="emptyLines"
            delims={["{", "}"]}
            content={members.map((member) => {
              const comment = member.comment;

              if ("let" in member) {
                // Member is LetInterfaceProps.
                const innerItem = (
                  <PreviewScopePopWrapper>
                    <Item
                      id={member.id}
                      noPreviewScope
                      noLoc
                      kw="let"
                      idRenderer={RenderFreshValue}
                      mapId={(ctx, exp) => {
                        return (
                          <>
                            {member.mut
                              ? (
                                <>
                                  <Mut />
                                  {" "}
                                </>
                              )
                              : ""}
                            {member.type === undefined
                              ? exp
                              : (
                                <TypeAnnotation type={member.type}>
                                  {exp}
                                </TypeAnnotation>
                              )}
                          </>
                        );
                      }}
                    >
                      {" "}
                      <AssignmentOp /> <exps x={member.children} />
                    </Item>
                  </PreviewScopePopWrapper>
                );

                if (comment === undefined) {
                  return innerItem;
                } else {
                  return {
                    commented: {
                      segment: innerItem,
                      comment,
                      dedicatedLine: true,
                    },
                  };
                }
              } else {
                const innerItem = (
                  <PreviewScopePopWrapper>
                    <Item
                      noLoc
                      noPreviewScope
                      id={member.id}
                      idRenderer={RenderFreshFunction}
                      previewAnnotation={null}
                    >
                      <FunctionLiteral
                        args={member.args}
                        ret={member.ret}
                        multilineArgs={member.multilineArgs}
                        generics={member.generics}
                        multilineGenerics={member.multilineGenerics}
                        body={member.body}
                      />
                    </Item>
                  </PreviewScopePopWrapper>
                );

                if (comment === undefined) {
                  return innerItem;
                } else {
                  return {
                    commented: {
                      segment: innerItem,
                      comment,
                      dedicatedLine: true,
                    },
                  };
                }
              }
            })}
            mapContentIndividual={(_ctx, c) => {
              return (
                <PreviewScopePopWrapper>
                  <AnnotatedPreviewScope dedent={1}>
                    <exps x={c} />
                  </AnnotatedPreviewScope>
                </PreviewScopePopWrapper>
              );
            }}
          />
        </SetPreviewAnnotation>
      </Loc>
    </AnnotatedPreviewScope>
  );
}

/**
 * Refer to an interface member as implemented by a type.
 */
export function QualifiedMember(
  { type, member }: { member: string; type: Expressions },
): Expression {
  return (
    <>
      <exps x={type} />
      <Deemph>::</Deemph>
      <R n={member} />
    </>
  );
}

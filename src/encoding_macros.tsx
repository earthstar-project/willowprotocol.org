import * as Colors from "https://deno.land/std@0.204.0/fmt/colors.ts";

import {
AccessStruct,
Code,
  createLogger,
  createSubstate,
  Def,
  DefFunction,
  DefType,
  DefValue,
  Expression,
  Expressions,
  M,
  Marginale,
  P,
  PreviewScope,
  R,
  Rs,
  Table,
  Td,
  Th,
  Tr,
} from "../deps.ts";

const l = createLogger("LoggerEncodings");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerEncodings };

/*
These encoding macros have two notions of hierarchy: the outer level of hierarchy are *templates* for defining specific kinds of encodings. There is the `EncodingRelationTemplate` for encoding relations, and the `EncodingRelationRelativeTemplate` for relative encoding relations.

Both of these introduce some state that can be conveniently referred to: the defref id of the encoding relation being defined (called `n`), and the name of the value being encoded (called `valName`).
The relative template also adds the name of the value relative to which one is encoding (called `relName`).

The templates add some boilerplate text around the core of the definition, the `<Encoding/>`. An <Encoding/> adds a bit more state: it allows for assigning ids to bitfields, and then defref-referencing these bitfields by those ids.

Within these macros, there's a bunch of macros for referring to those concepts (`n`, `valName`, `relName`, and bitfields): <ReldefName/> for `n`, <ValName> and <RelName>, and <Bitfield id="someId"/> for the bitfield of a given id.

In addition there are convenience macros for, e.g., doing struct field accesses on `vallName` and `relName`.

Behind the scenes, both templates and the <Encoding/> macro compute a bunch of new defref ids and bind them. If you ever get weird double-usage of defref ids because of these macros, just track down which ids are being computed (see directly below this comment for the general constructions) and adjust the names you supply accordingly.

Finally, at the end of this file, you find a bunch of macros that generate English phrases that we use throughout the spec (in a similar spirit as the template macros, but at a much smaller scale). Ideally, most encoding definitions are purely composed of macros and require barely any English input.
*/

function encvalN(n: string, valName: string): string {
  return `${n}_${valName}`;
}

function encrelN(n: string, relName: string): string {
  return `${n}_${relName}`;
}

function bitfieldN(n: string, bitfieldId: string): string {
  return `${n}__${bitfieldId}`;
}

// We carry some state around that we set with each EncodingRelationTemplate in order to provide macros that can reference the currently encoded value, the currently defined relation, etc.
type TemplateState = {
  /**
   * Defref id (`n` prop) for the encoding relation.
   */
  n: string;
  /**
   * The name of the value being encoded.
   */
  valName: string;
  /**
   * The name of the value relative to which we encode.
   */
  relName?: string;
};

const [getTemplateState, setTemplateState] = createSubstate<
  null | TemplateState
>(
  () => null,
);

// State per Encoding macro invocation. Those may be nested.
type EncodingState = {
  /**
   * Prefix for the bitfield defref ids.
   */
  idPrefix: string;
  /**
   * Information about bitfields for this encoding: their id, the offset at which they start, and their length.
   * id => [start, length]
   */
  bitfields: Map<string, [number, number]>;
};

const [getEncodingState, setEncodingState] = createSubstate<
  null | EncodingState
>(
  () => null,
);

//////////////////////////
// Encoding-Macro Stuff //
//////////////////////////

/**
 * The encodings we define all start with a number of bitfields divisible by eight, followed by any number of bytestrings to be concatenated.
 */
export type EncodingProps = {
  bitfields: BitfieldDef[];
  contents: EncodingContent[];
  idPrefix: string;
};

/**
 * Describes how to use some number of bits in the bitfields at the start of an encoding.
 */
export type BitfieldDef = {
  id?: string;
  count: number;
  content: Expressions;
  comment?: Expressions;
};

export type EncodingContent =
  | Expressions
  | {
    content: Expressions;
    comment: Expressions;
  };

export function Encoding(
  { bitfields, contents, idPrefix }: EncodingProps,
): Expression {
  let oldState: EncodingState | null = null;

  return (
    <lifecycle
      pre={(ctx) => {
        oldState = getEncodingState(ctx) === null
          ? null
          : { ...getEncodingState(ctx)! };
        const newState: EncodingState = {
          idPrefix,
          bitfields: new Map(),
        };
        setEncodingState(ctx, newState);
      }}
      post={(ctx) => {
        setEncodingState(ctx, oldState);
      }}
    >
      <impure
        fun={(ctx) => {
          if (bitfields.reduce((acc, cur) => acc + cur.count, 0) % 8 === 0) {
            l.warn(
              ctx,
              "An encoding defines a number of bitfields not divisible by eight.",
            );
          }

          const templateState = getTemplateState(ctx);
          const encState = getEncodingState(ctx)!;

          if (templateState === null) {
            l.error(
              ctx,
              `Must not use an ${
                Colors.yellow(`<Encoding>`)
              } macro outside an encoding template.`,
            );
            return ctx.halt();
          }

          let hasComments = false;
          let bitOffset = 0;

          const rows: Expression[] = [];

          if (bitfields.length > 0) {
            rows.push(
              <Tr>
                <Th clazz="bitCount">Bits</Th>
                <Th>Big-Endian Bitfield</Th>
              </Tr>,
            );
          }

          for (const { id, count, content, comment } of bitfields) {
            if (contents !== undefined) {
              hasComments = true;
            }

            if (id) {
              encState.bitfields.set(id, [bitOffset, count]);
            }

            rows.push(
              <Tr clazz="bitfieldDef clearright">
                {id
                  ? (
                    <>
                      <omnomnom>
                        <Def n={bitfieldN(idPrefix, id)} refClass="bitfield" />
                      </omnomnom>
                      <Td clazz="bitCount" id={bitfieldN(idPrefix, id)}>
                        <Bitrange start={bitOffset} count={count} />
                      </Td>
                    </>
                  )
                  : (
                    <Td clazz="bitCount">
                      <Bitrange start={bitOffset} count={count} />
                    </Td>
                  )}
                <Td clazz="bitDef">
                  {comment === undefined ? "" : (
                    <Marginale>
                      <exps x={comment} />
                    </Marginale>
                  )}
                  <exps x={content} />
                </Td>
              </Tr>,
            );
            bitOffset += count;
          }

          for (const rowOfContent of contents) {
            let content: Expressions = "";
            let comment: undefined | Expressions = undefined;

            if (typeof rowOfContent === "object" && "comment" in rowOfContent) {
              hasComments = true;
              content = rowOfContent.content;
              comment = rowOfContent.comment;
            } else {
              content = rowOfContent;
            }

            rows.push(
              <Tr clazz="bytesDef clearright">
                <Td colspan={2}>
                  {comment === undefined ? "" : (
                    <Marginale>
                      <exps x={comment} />
                    </Marginale>
                  )}
                  <exps x={content} />
                </Td>
              </Tr>,
            );
          }

          return (
            <>
              <Table
                clazz={hasComments
                  ? "encodingdef withremarks clearright"
                  : "encodingdef withoutremarks"}
              >
                <exps x={rows} />
              </Table>
            </>
          );
        }}
      />
    </lifecycle>
  );
}

function Bitrange(
  { start, count }: { start: number; count: number },
): Expression {
  if (count === 1) {
    return `${start}`;
  } else if (count === 2) {
    return `${start}, ${start + 1}`;
  } else {
    return `${start} – ${start + count - 1}`;
  }
}

/////////////////////////////////////
// EncodingRelationTemplate Things //
/////////////////////////////////////

export type EncodingRelationTemplateProps = {
  /**
   * Defref id (`n` prop) for the encoding relation. Also its display name. Should be in CamelCase.
   */
  n: string;
  /**
   * The type of values being encoded.
   */
  valType: Expressions;
  // /**
  //  * The name of the value being encoded. Should be in snake_case.
  //  */
  // valName: string;
  /**
   * A passage to be inserted after the `valName` has been bound but before the encoding is defined.
   */
  preDefs?: Expressions;
  /**
   * As given to `<Encoding/>`.
   */
  bitfields: BitfieldDef[];
  /**
   * As given to `<Encoding/>`.
   */
  contents: EncodingContent[];
  /**
   * Optionally render the definition of a canonic subset if this is supplied.
   */
  canonic?: CanonicSubsetProps;
};

export type CanonicSubsetProps = {
  /**
   * Defref id (`n` prop) for the canonic subset. Also its display name. Should be in snake_case.
   */
  n: string;
  /**
   * How to canonicise. Each one should complete a sentence of the form "The function is the subset obraint by <how>."
   */
  how: Expressions[];
};

export function EncodingRelationTemplate(
  { n, valType, preDefs, bitfields, contents, canonic }:
    EncodingRelationTemplateProps,
): Expression {
  const valName = "val";
  return (
    <TemplateLifecycle n={n} valName={valName}>
      <PreviewScope>
        {preDefs
          ? (
            <>
              <P>
                We define an <R n="encoding_relation" /> <DefType n={n} /> for
                {" "}
                <exps x={valType} />. Let{" "}
                <DefValue n={encvalN(n, valName)} r={valName} /> be any{" "}
                <exps x={valType} />.
              </P>
              {preDefs}
              <P>
                Then the <Rs n="code" /> in <R n={n} /> for{" "}
                <R n={encvalN(n, valName)} />{" "}
                are the bytestrings that are concatenations of the following
                form:
              </P>
            </>
          )
          : (
            <P>
              We define an <R n="encoding_relation" /> <DefType n={n} /> for
              {" "}
              <exps x={valType} />. The <Rs n="code" /> in <R n={n} /> for any
              {" "}
              <exps x={valType} />{" "}
              <DefValue n={encvalN(n, valName)} r={valName} />{" "}
              are the bytestrings that are concatenations of the following form:
            </P>
          )}
      </PreviewScope>

      <Encoding
        idPrefix={n}
        bitfields={bitfields}
        contents={contents}
      />

      {canonic === undefined ? "" : (
        <P>
          We define the <R n="encoding_function" />{" "}
          <DefFunction n={canonic.n} /> as the <R n="canonic" /> subset of{" "}
          <R n={n} /> obtained by <How how={canonic.how} />
        </P>
      )}
    </TemplateLifecycle>
  );
}
/**
 * Additional props for `EncodingRelationRelativeTemplate` beyond the `EncodingRelationTemplateProps`.
 */
export type RelativeRelationProps = {
  // relName: string;
  relToDescription: Expressions;
};

export function EncodingRelationRelativeTemplate(
  {
    n,
    valType,
    preDefs,
    bitfields,
    contents,
    canonic,
    relToDescription,
  }: EncodingRelationTemplateProps & RelativeRelationProps,
): Expression {
  const valName = "val";
  const relName = "rel";
  return (
    <TemplateLifecycle n={n} valName={valName} relName={relName}>
      <PreviewScope>
        {preDefs
          ? (
            <>
              <P>
                We define a <R n="relative_encoding_relation" />{" "}
                <DefType n={n} /> for any <exps x={valType} /> relative to any
                {" "}
                <exps x={relToDescription} />. Let{" "}
                <DefValue n={encvalN(n, valName)} r={valName} /> be any{" "}
                <exps x={valType} />, and let{" "}
                <DefValue n={encrelN(n, relName)} r={relName} /> be any{" "}
                <exps x={relToDescription} />.
              </P>
              {preDefs}
              <P>
                Then the <Rs n="code" /> in <R n={n} /> for{" "}
                <R n={encvalN(n, valName)} /> relative to{" "}
                <R n={encrelN(n, relName)} />{" "}
                are the bytestrings that are concatenations of the following
                form:
              </P>
            </>
          )
          : (
            <P>
              We define a <R n="relative_encoding_relation" /> <DefType n={n} />
              {" "}
              for any <exps x={valType} /> relative to any{" "}
              <exps x={relToDescription} />. The <Rs n="code" /> in <R n={n} />
              {" "}
              for any <exps x={valType} />{" "}
              <DefValue n={encvalN(n, valName)} r={valName} /> relative to any
              {" "}
              <exps x={relToDescription} />{" "}
              <DefValue n={encrelN(n, relName)} r={relName} />{" "}
              are the bytestrings that are concatenations of the following form:
            </P>
          )}
      </PreviewScope>

      <Encoding
        idPrefix={n}
        bitfields={bitfields}
        contents={contents}
      />

      {canonic === undefined ? "" : (
        <P>
          We define the <R n="relative_encoding_function" />{" "}
          <DefFunction n={canonic.n} /> as the <R n="canonic" /> subset of{" "}
          <R n={n} /> obtained by <How how={canonic.how} />
        </P>
      )}
    </TemplateLifecycle>
  );
}

/**
 * Shared lifecycle state management between absolute and relative encoding relation templates.
 */
function TemplateLifecycle(
  { n, valName, relName, children }: {
    n: string;
    valName: string;
    relName?: string;
    children: Expressions;
  },
): Expression {
  const myState: TemplateState = {
    n,
    valName,
    relName,
  };

  // Lifecycle to set up an isolated state for this template. Templates cannot be nested.
  return (
    <lifecycle
      pre={(ctx) => {
        const state = getTemplateState(ctx);
        if (state !== null) {
          l.error(
            ctx,
            `Must not nest ${Colors.yellow(`<EncodingTemplate>`)} macros.`,
          );
          return ctx.halt();
        }

        setTemplateState(ctx, myState);
      }}
      post={(ctx) => {
        setTemplateState(ctx, null);
      }}
    >
      <exps x={children} />
    </lifecycle>
  );
}

function How({ how }: { how: Expressions[] }): Expression {
  if (how.length === 1) {
    return (
      <>
        <exps x={how[0]} />.
      </>
    );
  } else if (how.length === 2) {
    return (
      <>
        <exps x={how[0]} />, and <exps x={how[1]} />.
      </>
    );
  } else {
    const acc: Array<Expression> = ["<ul>"];

    for (let i = 0; i < how.length; i++) {
      if (i !== 0) {
        acc.push(`,${i === how.length - 1 ? " and" : ""} </li>`);
      }

      acc.push("<li>");

      acc.push(<exps x={how[i]} />);
    }

    return (
      <>
        <exps x={acc} />
        {".</li></ul>"}
      </>
    );
  }
}

////////////////////////////////////////////////////////////////////////
// Macros for (convenient) references to encoding and template state. //
////////////////////////////////////////////////////////////////////////

/**
 * Creates a defref <R> to the encoding relation being defined.
 */
export function ReldefName(): Expression {
  return (
    <impure
      fun={(ctx) => {
        const state = getTemplateState(ctx);

        if (state === null) {
          l.error(
            ctx,
            `Must not use the ${
              Colors.yellow(`<ValName/>`)
            } macro outside of an encoding template.`,
          );
          return ctx.halt();
        }

        return <R n={state.n} />;
      }}
    />
  );
}

/**
 * Creates a defref <R> to the value being encoded.
 */
export function ValName(): Expression {
  return (
    <impure
      fun={(ctx) => {
        const state = getTemplateState(ctx);

        if (state === null) {
          l.error(
            ctx,
            `Must not use the ${
              Colors.yellow(`<ValName/>`)
            } macro outside of an encoding template.`,
          );
          return ctx.halt();
        }

        return <R n={encvalN(state.n, state.valName)} />;
      }}
    />
  );
}

/**
 * Creates a struct field access on the value being encoded.
 */
export function ValAccess({ field } : {field: string}): Expression {
  return <AccessStruct field={field}><ValName/></AccessStruct>;
}

/**
 * Creates a defref <R> to the value relative to which we encode.
 */
export function RelName(): Expression {
  return (
    <impure
      fun={(ctx) => {
        const state = getTemplateState(ctx);

        if (state === null) {
          l.error(
            ctx,
            `Must not use the ${
              Colors.yellow(`<RelName/>`)
            } macro outside of an encoding template.`,
          );
          return ctx.halt();
        }

        if (state.relName === undefined) {
          l.error(
            ctx,
            `Must not use the ${
              Colors.yellow(`<RelName/>`)
            } macro in a non-relative encoding template.`,
          );
          return ctx.halt();
        }

        return <R n={encrelN(state.n, state.relName)} />;
      }}
    />
  );
}

/**
 * Creates a reference to a bitfield in the current encoding.
 */
export function Bitfield({ id }: { id: string }): Expression {
  return (
    <impure
      fun={(ctx) => {
        const encState = getEncodingState(ctx);

        if (encState === null) {
          l.error(
            ctx,
            `Must not use the ${
              Colors.yellow(`<RefBitfield/>`)
            } macro outside of an encoding template.`,
          );
          return ctx.halt();
        }

        const info = encState.bitfields.get(id);
        if (info === undefined) {
          l.warn(
            ctx,
            `Tried to use <RefBitfield/> with an undefined bitfield d: ${id}.`,
          );
          return `Oops, invalid bitfield id: ${id}`;
        } else {
          return (
            <R n={bitfieldN(encState.idPrefix, id)}>
              <Bitrange start={info[0]} count={info[1]} />
            </R>
          );
        }
      }}
    />
  );
}

///////////////////////////////////////////////////////////////////////////////
// Macros for natural language phrases we use consistently in encoding defs. //
///////////////////////////////////////////////////////////////////////////////

/**
 * The standard phrase for indicating that a canonic subset of an encoding relation must only use minimal c64 tags.
 */
export function MinTags(): Expression {
  return (
    <>
      using only <R n="c64_minimal" /> <Rs n="c64_tag" />
    </>
  );
}

/**
 * The standard phrase for indicating that a canonic subset of an encoding relation must only use canonic forms of sub-encodings.
 */
export function CanonicSubencodings(): Expression {
  return (
    <>
      using only the <R n="canonic" /> subsets of all sub-encodings
    </>
  );
}

/**
 * The standard phrase for indicating that a value must be chosen maximally.
 */
export function ChooseMaximal({ n }: { n: string }): Expression {
  return (
    <>
      choosing the greatest possible <R n={n} />
    </>
  );
}

/**
 * The standard phrase for indicating that a value must be chosen minimally.
 */
export function ChooseMinimal({ n }: { n: string }): Expression {
  return (
    <>
      choosing the least possible <R n={n} />
    </>
  );
}

/**
 * Creates an encoding content that is a corresponding c64 encoding for a c64 tag at a given bitfield id.
 */
export function C64Encoding({ id }: { id: string }): Expression {
  return (
    <>
      The <R n="c64_corresponding" /> for bits <Bitfield id={id} />.
    </>
  );
}

/**
 * An encoding content for encoding some value according to some encoding relation (optionally relative).
 */
export function CodeFor(
  { enc, relativeTo, children }: {
    enc: string;
    relativeTo?: Expressions;
    children: Expressions;
  },
): Expression {
  return (
    <>
      Any {relativeTo ? <R n="rel_code" /> : <R n="code" />} in <R n={enc} />
      {" "}
      for <exps x={children} />
      {relativeTo
        ? (
          <>
            , relative to <exps x={relativeTo} />
          </>
        )
        : ""}.
    </>
  );
}

/**
 * Returns a `BitfieldDef` for a c64 tag.
 */
export function c64Tag(
  id: string,
  count: number,
  what: Expressions,
): BitfieldDef {
  return {
    id,
    count,
    content: (
      <>
        A <R n="c64_tag" /> of <R n="c64_width" /> <M>{`${count}`}</M> for{" "}
        <exps x={what} />.
      </>
    ),
  };
}

/**
 * Returns a `BitfieldDef` for a constant bitstring.
 */
export function bitfieldConstant(
  bits: number[],
): BitfieldDef {
  return {
    count: bits.length,
    content: (
      <>
        The bitstring <Code>{bits.map(b => `${b}`).join("")}</Code>.
      </>
    ),
  };
}

/**
 * Creates an encoding content that is an 8-bit c64 tag for some value (the children), followed by the corresponding c64 encoding.
 */
export function C64Standalone({ children }: { children: Expressions }): Expression {
  return (
    <>
      A <R n="c64_tag"/> of <R n="c64_width"/> <M>8</M> for <exps x={children}/>, followed by the <R n="c64_corresponding"/>.
    </>
  );
}

/**
 * The phrase for using the raw bytes of some bytestring in an encoding.
 */
export function RawBytes({ children, lowercase, noPeriod }: { children: Expressions, lowercase?: boolean, noPeriod?: boolean }): Expression {
  return (
    <>
      {lowercase ? "the" : "The"} raw bytes of <exps x={children}/>{noPeriod ? "" : "."}
    </>
  );
}
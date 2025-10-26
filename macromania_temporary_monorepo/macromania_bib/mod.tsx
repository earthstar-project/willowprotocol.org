import {
  Def,
  dependencyCss,
  dependencyJs,
  Div,
  PreviewScope,
  PreviewScopePushWrapper,
  R,
  ResolveAsset,
  Span,
} from "../mod.tsx";
import { Config } from "./deps.ts";
import { createConfigOptions } from "./deps.ts";
import {
  CiteJs,
  Colors,
  Context,
  createLogger,
  createSubstate,
  CSL,
  Expression,
  Expressions,
} from "./deps.ts";

import defaultStyle from "./styles/din-1505-2.csl.json" with { type: "json" };
import locales from "./locales.json" with { type: "json" };

// non-breaking space html escape.
const nbsp = "&nbsp;";

const l = createLogger("LoggerBib");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerBib };

/**
 * Okay, this citation business is more complicated than one might assume. Our state management is informed by
 * the demands of the citeproc-js APIs.
 *
 * Users place `<BibScope>` macros to create scopes that handle citations fully independently from all other
 * bibscopes. The cannot be nested. The `ScopeState` is the state we have to track per bibscope.
 *
 * Citations cannot be rendered immediately when encountering a macro that adds them. For the most accurate
 * citing styles, we want to first collect all citations that happen in a bibscope, and then render them once
 * we have all of them. Unfortunately, we cannot raelly know when we have everything, so we stay in the phase of
 * collecting information without rendering as long as possible.
 */
type ScopeState = {
  /**
   * Are we still collecting information (true), or do we proceed with rendering citations (false)?
   */
  stillCollecting: boolean;
  /**
   * Each time a macro creates a citation, we track that citation in an array. As long as the citation-adding macros
   * are processed in the order in which they appear in the rendered document, the array ordering will accurately
   * reflect that order. It is this order that we present to citeproc-js as the order of the references. If macros
   * are evaluated in an order diverging from their position in the text, citation rendering will be inaccurate (for
   * styles that *care* about ordering, that is).
   */
  citations: CitationState[];
  /**
   * The citeproc CSL.Engine to use for this bibscope.
   */
  citeproc: unknown;
  /**
   * Metadata about the items, keyed by itemIds.
   */
  items: Map<string, ItemDeclaration>;
};

/**
 * The state we track for each citation in the bibscope.
 */
type CitationState = {
  /**
   * The citation object to pass to citeproc-js.
   */
  citation: Citation;
  /**
   * The rendered citation to put into the document.
   * Starts out with a dummy value (`"[?]"`).
   */
  rendered: string;
};

/**
 * A citation object to pass to citeproc-js.
 *
 * See https://citeproc-js.readthedocs.io/en/latest/csl-json/markup.html#citations
 */
type Citation = {
  citationID: string; // A unique id (within a bibscope) that identifies this particular Citation.
  citationItems: CitationItem[];
  properties: {
    /**
     * Indicates the footnote number in which the citation is located within the document. Citations within the main text of the document have a noteIndex of zero.
     */
    noteIndex: number;
  };
};

/**
 * Cite-items describe a specific reference to a bibliographic item. The fields that a cite-item may contain depend on its context. In a citation, cite-items listed as part of the citationItems array provide only pinpoint, descriptive, and text-suppression fields:
 */
type CitationItem = {
  // No idea what this is or which contracts it must uphold. The citeproc docs are not the best =/
  // We'll just make them bibscope-unique and unchanging and hope that works.
  id: string;
  /**
   * String identifying a page number or other pinpoint location or range within the resource.
   */
  locator?: number;
  /**
   * A  label type, indicating whether the locator is to a page, a chapter, or other subdivision of the target resource. Valid labels are defined in the CSL specification: https://docs.citationstyles.org/en/stable/specification.html
   */
  label?: string;
  /**
   * A string to print before this cite item.
   */
  prefix?: string;
  /**
   * A  string to print after this cite item.
   */
  suffix?: string;
  /**
   * If true, author names will not be included in the citation output for this cite.
   */
  "suppress-author"?: boolean;
  /**
   * If true, only the author name will be included in the citation output for this cite – this optional parameter provides a means for certain demanding styles that require the processor output to be divided between the main text and a footnote.
   */
  "author-only"?: boolean;
  /**
   * An integer flag that indicates whether the cite item should be rendered as a first reference, an immediately-following reference (i.e. ibid), an immediately-following reference with locator information, or a subsequent reference.
   */
  position?: number;
  /**
   * A boolean flag indicating whether another reference to this resource can be found within a specific number of notes, counting back from the current position. What is “near” in this sense is style-dependent.
   */
  "near-note"?: boolean;
};

const [getState, setState] = createSubstate<null | ScopeState>(
  () => null,
);

export type BibScopeProps = {
  /**
   * CSL style as serialized xml.
   */
  style?: string;
  /**
   * A language tag to select the locale. Defaults to "en-US".
   */
  lang?: string;
  /**
   * Whether the `lang` prop should overwrite the default locale of the `style`.
   */
  forceLang?: boolean;
  /**
   * The items that can be cited in this bibscope.
   */
  items: BibItemDeclaration[];
  /**
   * Macros to render inside the bibscope.
   */
  children?: Expressions;
};

/**
 * An item to cite, optionally with a hyperlink or an asset path to retrieve that item.
 */
export type BibItemDeclaration = {
  /**
   * A url at which to find the item. All citations of this item will link to this.
   */
  href?: string;
  /**
   * If the cited item is in the asset directory, specify its asset path here.
   *
   * If this is present, `href` will be ignored, and items link to the asset instead.
   */
  asset?: string[];
  /**
   * The item to cite, as a javascript object conforming to the [CSL-JSON documentation](https://citeproc-js.readthedocs.io/en/latest/csl-json/markup.html#items), or as a string of BibTex.
   */
  item: BibItem | string;
  /**
   * Should the item be included in the bibliography even if it does not get cited? Defaults to false.
   */
  includeEvenIfNotCited?: boolean;
  /**
   * A blurb to show in the citation preview. For typical scientific works, this would be the abstract.
   */
  blurb?: Expressions;
};

/**
 * Same as BibItemDeclaration, except the `item` must be a BibItem.
 */
type ItemDeclaration = {
  href?: string;
  asset?: string[];
  item: BibItem;
  includeEvenIfNotCited?: boolean;
  blurb?: Expressions;
};

/**
 * An item is a single bundle of metadata for a source to be referenced. See the [CSL Specification](https://docs.citationstyles.org/en/stable/specification.html) for details on the fields available on an item, and the [CSL-JSON docs](https://citeproc-js.readthedocs.io/en/latest/csl-json/markup.html) for the format of specific field types. Every item must have an id and a type.
 */
export interface BibItem {
  /**
   * The id field is a simple field containing any string or numeric value. The value of the ID field must uniquely identify the item, as this field is used to retrieve items by their ID value.
   */
  id: string | number;
  /**
   * The type field is a simple field containing a string value. CSL-JSON constrains the possible for values of the type field to a limited set of possible values (e.g., “book” or “article”). The type must be a valid CSL type under the schema of the installed style. See the schemata of [CSL](https://github.com/citation-style-language/schema/blob/master/csl-types.rnc) and [CSL-M](https://github.com/Juris-M/schema/blob/master/csl-mlz.rnc#L763) for their respective lists of valid types.
   */
  type: string;
}

export function BibScope(
  { style = defaultStyle, lang = "en-Us", forceLang = false, items, children }:
    BibScopeProps,
): Expression {
  return (
    <impure
      fun={(ctx) => {
        // Impure so we can do logging.

        const itemMap: Map<string, ItemDeclaration> = new Map();
        const citableItems = [];
        const uncitedItems = [];

        for (const itemDeclaration of items) {
          let actualItem: BibItem;

          if (typeof itemDeclaration.item === "string") {
            try {
              const citeJs = new CiteJs(itemDeclaration.item, {
                forceType: "@bibtex/text",
              });

              const parsed = citeJs.format("data", {
                format: "object",
                // deno-lint-ignore no-explicit-any
              }) as any;
              actualItem = parsed[0] as BibItem;
            } catch (err) {
              l.warn(ctx, `Error parsing bibtex input:`);
              l.at(ctx);
              l.warn(ctx, err);
              continue;
            }
          } else {
            actualItem = itemDeclaration.item;
          }

          const decl = {
            href: itemDeclaration.href,
            asset: itemDeclaration.asset,
            includeEvenIfNotCited: itemDeclaration.includeEvenIfNotCited,
            item: actualItem,
            blurb: itemDeclaration.blurb,
          };

          itemMap.set(`${actualItem.id}`, decl);

          if (decl.includeEvenIfNotCited) {
            uncitedItems.push(decl.item.id);
          } else {
            citableItems.push(decl.item.id);
          }
        }

        const citeproc = new CSL.Engine(
          {
            retrieveLocale: (localeId: string) => {
              if (localeId === "us") {
                return locales["en-US"];
              } else {
                return (locales as Record<string, unknown>)[localeId];
              }
            },
            retrieveItem: (itemId: string | number) => {
              return itemMap.get(`${itemId}`)?.item;
            },
          },
          style,
          lang,
          forceLang,
        );

        citeproc.updateUncitedItems(uncitedItems);
        citeproc.updateItems(citableItems);

        const myState: ScopeState = {
          stillCollecting: true,
          citations: [],
          citeproc,
          items: itemMap,
        };

        // Lifecycle to set up an isolated state for this bibscope.
        return (
          <lifecycle
            pre={(ctx) => {
              const state = getState(ctx);
              if (state !== null) {
                l.error(
                  ctx,
                  `Must not nest ${Colors.yellow(`<BibScope>`)} macros.`,
                );
                return ctx.halt();
              }

              setState(ctx, myState);
            }}
            post={(ctx) => {
              setState(ctx, null);
            }}
          >
            <exps x={children} />
          </lifecycle>
        );
      }}
    />
  );
}

export type CiteProps = {
  /**
   * The ids of the items to cite (one or more).
   */
  item: string | string[];
  /**
   * Children, if any, turn into a link to the cited item.
   */
  children?: Expressions;
};

/**
 * Cite one or more items by their itemID. If this has children, they will turn into a link.
 */
export function Bib({ item, children }: CiteProps): Expression {
  const items = Array.isArray(item) ? item : [item];

  // For logging only.
  const renderedMacro = Colors.yellow(
    `<Bib${
      children === undefined ||
        (Array.isArray(children) && children.length === 0)
        ? "/"
        : ""
    }>`,
  );

  let firstEvaluation = true;

  let ourIndexInArrayOfAllCitations = -1;

  return (
    <impure
      fun={(ctx) => {
        const state = getState(ctx);

        if (state === null) {
          l.error(
            ctx,
            `${renderedMacro} macro must only be used inside a ${
              Colors.yellow(`<BibScope>`)
            } macro.`,
          );
          return ctx.halt();
        }

        for (const it of items) {
          if (!state.items.has(it)) {
            l.warn(ctx, `Tried to cite unknown itemID: ${styleCiteId(it)}`);
            l.at(ctx);
            return (
              <>
                <exps x={children} />
                {nbsp}
                {"[?]"}
              </>
            );
          }
        }

        if (firstEvaluation) {
          firstEvaluation = false;

          if (items.length === 0) {
            l.warn(
              ctx,
              `Each ${renderedMacro} should cite at least one item.`,
            );
            l.at(ctx);
          }

          // If the bibliography did not render yet, we are good.
          // We register the citation and then do nothing until the bibliography has rendered.
          if (state.stillCollecting) {
            ourIndexInArrayOfAllCitations = state.citations.length;

            state.citations.push({
              rendered: "[?]",
              citation: {
                citationID: `citation${state.citations.length}`,
                citationItems: items.map((id) => ({
                  id,
                })),
                properties: {
                  noteIndex: 0,
                },
              },
            });

            return null;
          } else {
            // Oh no, the bibliography was alrady rendered without us.
            l.warn(
              ctx,
              `Added a citation after the corresponding bibliography has already been rendered.`,
            );
            l.logGroup(ctx, () => {
              l.warn(
                ctx,
                `To understand this warning and how to fix it, you need to understand how Macromania allows postponing macro evaluations until a later point.`,
              );
              l.warn(
                ctx,
                `Every ${renderedMacro} macro's first evaluation attempt must happen before the first ${
                  Colors.yellow("<Bibliography/>")
                } macro of its ${
                  Colors.yellow("<BibScope>")
                } finishes rendering.`,
              );
              l.warn(
                ctx,
                `The ${
                  Colors.yellow("<Bibliography/>")
                } macro attempts to render as late as possible: only when the Macromania ${
                  Colors.yellow("ctx.mustMakeProgress()")
                } function returns ${Colors.yellow("true")} will the bibliography be finalized.`,
              );
              l.warn(
                ctx,
                `Unfortunately, this ${renderedMacro} macro has not been evaluated even once by that time. And that is the problem you now need to fix. Good luck <3.`,
              );
            });
            l.at(ctx);
            return null;
          }
        } else {
          // Not the first evaluation.
          if (state.stillCollecting) {
            // Until the bibliography has rendered (and updated the scope state
            // with information on how to render this very reference), we do nothing.
            return null;
          } else {
            // The state contains information on how to render this citation. Let's do that.

            if (ourIndexInArrayOfAllCitations === -1) {
              // This citation was evaluated too late. We already printed a warning.
              return (
                <>
                  <Span clazz="bibText">
                    <exps x={children} />
                  </Span>
                  {nbsp}
                  <Span clazz="bibCitation">{`[?]`}</Span>
                </>
              );
            } else {
              const info = state.citations[ourIndexInArrayOfAllCitations];
              const ourId = info.citation.citationItems.map((item) => item.id)
                .join("");
              const rendered = info.rendered;

              return (
                <R n={ourId}>
                  <Span clazz="bibText">
                    <exps x={children} />
                  </Span>
                  {nbsp}
                  <Span clazz="bibCitation">{rendered}</Span>
                </R>
              );
            }
          }
        }
      }}
    />
  );
}

/**
 * Render a bibliography for the current BibScope.
 * Each BibScope must contain at least one Bibliography macro.
 */
export function Bibliography(): Expression {
  return (
    <impure
      fun={(ctx) => {
        const state = getState(ctx);

        if (state === null) {
          l.error(
            ctx,
            `${
              Colors.yellow("<Bibliography/>")
            } macro must only be used inside a ${
              Colors.yellow(`<BibScope>`)
            } macro.`,
          );
          return ctx.halt();
        }

        if (state.stillCollecting && !ctx.mustMakeProgress()) {
          // Delay evaluation as long as possible, so that all citations make it in.
          return null;
        }

        // The first bibliography gets to issue DefRef definitions, all remaining bibliographies then use those.
        const first = state.stillCollecting;
        state.stillCollecting = false;

        // Inform citeproc about all references.
        for (let i = 0; i < state.citations.length; i++) {
          const citation = state.citations[i];

          // deno-lint-ignore no-explicit-any
          const result = (state.citeproc as any).processCitationCluster(
            citation.citation,
            state.citations.slice(0, i).map((
              c,
              j,
            ) => [c.citation.citationID, j + 1]),
            [],
          );

          // const citation_errors = result[0].citation_errors as unknown[];

          const updates = result[1] as ([
            number, /* index in state.citations */
            string, /* rendered citation */
          ])[];
          for (const [citationsIndex, rendered] of updates) {
            state.citations[citationsIndex].rendered = rendered;
          }
        }

        // Obtain bibliography data from citeproc.
        // deno-lint-ignore no-explicit-any
        const bibliography = (state.citeproc as any).makeBibliography();

        const { linespacing, entryspacing, hangingindent } = bibliography[0];
        const secondFieldAlign: false | "flush" | "margin" =
          bibliography[0]["second-field-align"];

        let spacingSeparator = "";
        for (let i = 0; i < linespacing * entryspacing; i++) {
          spacingSeparator = `${spacingSeparator}<br />`;
        }

        // Render the bibliography.
        const ret: Expression[] = [];

        // A map from itemIDs to their csl-left-margin (if secondFieldAlign is truthy, unused otherwise).
        const leftMargins: Map<string, string> = new Map();

        for (let i = 0; i < bibliography[1].length; i++) {
          if (i !== 0) {
            ret.push(spacingSeparator);
          }

          const entryId: string = bibliography[0].entry_ids[i][0];
          const rendered: string = bibliography[1][i];
          const renderedRaw = rendered
            .slice(0, -7) // remove trailing `</div>`
            .replace(`<div class="csl-entry">`, "");
          const href = itemIdToHref(ctx, entryId);
          const blurb = itemIdToBlurb(ctx, entryId);

          if (secondFieldAlign) {
            const [pre_, post_] = renderedRaw.split("</div>", 2);
            const pre = `${pre_}</div>`;
            const post = `${post_}</div>`;

            leftMargins.set(entryId, pre);

            const def = (
              <Def
                n={entryId}
                r={post}
                defTag={(inner, id) => <exps x={inner} />}
                noHighlight
                fake={!first}
                href={href}
                noLink={!href}
                noTooltipOnDefHover
                refClass="bib"
                preview={blurb
                  ? (
                    <>
                      {renderedRaw}
                      <Div clazz="bibBlurb">{blurb}</Div>
                    </>
                  )
                  : renderedRaw}
              />
            );

            ret.push(
              <>
                <Span id={entryId}>{pre}</Span>
                {def}
              </>
            );
          } else {
            ret.push(
              <Def
                n={entryId}
                r={renderedRaw}
                defTag={(inner, id) => (
                  <Div id={id}>
                    <exps x={inner} />
                  </Div>
                )}
                noHighlight
                fake={!first}
                href={href}
                noLink={!href}
                noTooltipOnDefHover
                refClass="bib"
                preview={blurb
                  ? (
                    <>
                      {renderedRaw}
                      <Div clazz="bibBlurb">{blurb}</Div>
                    </>
                  )
                  : renderedRaw}
              />,
            );
          }
        }

        // For each citation that cites more than a single item, create a Def for that citation to use.

        const idsForWhichWeAlreadyCreatedADef: Set<string> = new Set();

        if (first) {
          for (let i = 0; i < state.citations.length; i++) {
            const citation = state.citations[i].citation;
            if (citation.citationItems.length > 1) {
              let idConcat = "";

              citation.citationItems.forEach((item) => {
                idConcat = `${idConcat}${item.id}`;
              });

              const bibliographyOrdering: string[] = bibliography[0].entry_ids
                // deno-lint-ignore no-explicit-any
                .map((idArr: any) => idArr[0]);

              const sorted = [...citation.citationItems];
              sorted.sort((a, b) => {
                const indexOfA = bibliographyOrdering.indexOf(a.id);
                const indexOfB = bibliographyOrdering.indexOf(b.id);

                return indexOfA < indexOfB ? -1 : (indexOfA > indexOfB ? 1 : 0);
              });

              const refs: Expression[] = [];
              sorted.forEach((item, j) => {
                if (j !== 0) {
                  refs.push(spacingSeparator);
                }

                if (secondFieldAlign) {
                  refs.push(
                    <>
                      <Span id={item.id}>{leftMargins.get(item.id)!}</Span>
                      <R n={item.id} noPreview />
                    </>,
                  );
                } else {
                  refs.push(
                    <Div clazz="csl-entry">
                      <R n={item.id} noPreview />
                    </Div>,
                  );
                }
              });

              if (idsForWhichWeAlreadyCreatedADef.has(idConcat)) {
                continue;
              }
              idsForWhichWeAlreadyCreatedADef.add(idConcat);

              const href = itemIdToHref(ctx, citation.citationItems[0].id);
              ret.push(
                <omnomnom>
                  <Def
                    n={idConcat}
                    defTag={(inner, id) => {
                      if (href) {
                        return (
                          <Div id={id} clazz="csl-entry" children={inner} />
                        );
                      } else {
                        return (
                          <Div id={id} clazz="csl-entry">
                            <Span children={inner} />
                          </Div>
                        );
                      }
                    }}
                    noHighlight
                    noTooltipOnDefHover
                    href={href}
                    noLink={!href}
                    preview={<exps x={refs} />}
                    refClass="bib"
                  />
                </omnomnom>,
              );
            }
          }
        }

        return (
          <PreviewScopePushWrapper
            wrapper={(ctx, exp) => (
              <Div
                clazz={`csl-bib-body${hangingindent ? " hangingindent" : ""}${
                  secondFieldAlign ? ` ${secondFieldAlign}` : ""
                }`}
              >
                <exps x={exp} />
              </Div>
            )}
          >
            <Div
              clazz={`csl-bib-body${hangingindent ? " hangingindent" : ""}${
                secondFieldAlign ? ` ${secondFieldAlign}` : ""
              }`}
            >
              <exps x={ret} />
            </Div>
          </PreviewScopePushWrapper>
        );
      }}
    />
  );
}

function itemIdToHref(ctx: Context, itemId: string): Expression | undefined {
  const state = getState(ctx)!;
  const itemDeclaration = state.items.get(itemId)!;

  const href: Expression | undefined = itemDeclaration.asset !== undefined
    ? <ResolveAsset asset={itemDeclaration.asset} />
    : (itemDeclaration.href ? itemDeclaration.href : undefined);

  return href;
}

function itemIdToBlurb(ctx: Context, itemId: string): Expression | undefined {
  const state = getState(ctx)!;
  const itemDeclaration = state.items.get(itemId)!;

  return itemDeclaration.blurb === undefined
    ? undefined
    : <exps x={itemDeclaration.blurb} />;
}

export function styleCiteId(id: string): string {
  return Colors.brightYellow(id);
}

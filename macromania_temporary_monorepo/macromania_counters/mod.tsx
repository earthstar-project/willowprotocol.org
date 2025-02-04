import { DebuggingInformation } from "./deps.ts";
import { styleDebuggingInformation } from "./deps.ts";
import { Colors, Context, createLogger, Expression } from "./deps.ts";

const l = createLogger("LoggerCounter");
const ConfigMacro = l.ConfigMacro;
export { ConfigMacro as LoggerCounter };

/**
 * A counter that can be incremented. The counter can be assigned a parent
 * counter. Whenever an ancestor counter is incremented, all its descendents
 * reset to their initial value.
 * 
 * All accesses to a counter have to occur in a single round of evaluation.
 */
export class Counter {
  private parent: Counter | null;
  private children: Set<Counter>;
  private value: number;
  private activeRound: null | [number, DebuggingInformation];
  private readonly initialValue: number;
  private readonly name: string;

  /**
   * Create a new counter with a given intial value and optionally a parent.
   *
   * @param initialValue The initial value of the counter. The counter gets
   * reset to this value whenever an ancestor is incremented.
   * @param parent The parent counter, if there is one.
   */
  constructor(
    name: string,
    initialValue: number,
    parent?: Counter,
  ) {
    this.parent = parent ?? null;
    this.children = new Set();
    this.value = initialValue;
    this.initialValue = initialValue;
    this.name = name;
    this.activeRound = null;

    if (parent) {
      parent.children.add(this);
    }
  }

  /**
   * Assign a (new) parent to this counter. Pass `null` to turn into a root.
   */
  public setParent(newParent: Counter | null) {
    if (this.parent !== null) {
      this.parent.children.delete(this);
    }

    this.parent = newParent;

    if (newParent !== null) {
      newParent.children.add(this);
    }
  }

  /**
   * Get the parent counter of the given counter.
   */
  public getParent(): Counter | null {
    return this.parent;
  }

  /**
   * Return the value of this counter.
   */
  public getOwnValue(ctx: Context): number {
    this.trackRound(ctx, "Getting");
    return this.value;
  }

  /**
   * Return an array of the values of all descendents (including, as the final
   * value, this counter itself).
   */
  public getFullValue(ctx: Context): number[] {
    this.trackRound(ctx, "Getting");
    if (this.parent === null) {
      return [this.getOwnValue(ctx)];
    } else {
      return [...this.parent.getFullValue(ctx), this.getOwnValue(ctx)];
    }
  }

  /**
   * Increase the value of this counter by one. Reset all descendent counters
   * to their initial values.
   */
  public increment(ctx: Context) {
    this.trackRound(ctx, "Incrementing");
    this.value += 1;
    this.children.forEach((child) => child.reset(ctx));
  }

  private reset(ctx: Context) {
    this.trackRound(ctx, "Resetting");
    this.value = this.initialValue;
    this.children.forEach((child) => child.reset(ctx));
  }

  public trackRound(ctx: Context, gerund: string) {
    const round = ctx.getRound();

    if (this.activeRound === null) {
      this.activeRound = [round, ctx.getCurrentDebuggingInformation()];
    } else if (this.activeRound[0] !== round) {
      l.error(
        ctx,
        `${gerund} value of counter ${styleCounter(this.name)} in evaluation round ${
          Colors.yellow(`${round}`)
        } (at counter value ${
          Colors.brightYellow(`${this.value}`)
        }), but it was already interacted with in a prior round.`,
      );
      l.logGroup(ctx, () => {
        l.error(
          ctx,
          `The previous interaction happened at ${
            styleDebuggingInformation(this.activeRound![1])
          } ...`,
        );
        l.error(
          ctx,
          `... in round ${Colors.yellow(`${this.activeRound![0]}`)}.`,
        );
      });
      ctx.halt();
    }
  }
}

function styleCounter(name: string) {
  return Colors.brightBlue(name);
}

/**
 * Create a function for rendering the full values of counters.
 * @param sliceStart Skip rendering the first `sliceStart` numbers.
 * @param sliceEnd Stop rendering numbers after `sliceEnd` many. Ignored when
 * `undefined`.
 * @param renderNumber How to render a number. Defaults to base 10.
 * @param renderBetween What to render between number `i` and `i + 1`.
 * Defaults to a dot.
 * @returns A function that takes a `Context` and an array of numbers as
 * returned by `Counter.getFullValue()`, and renders them into an `Expression`.
 */
export function makeNumberingRenderer(
  sliceStart = 0,
  sliceEnd?: number,
  renderNumber = (ctx: Context, num: number): Expression => `${num}`,
  renderBetween = (ctx: Context, i: number): Expression => ".",
): (ctx: Context, numbering: number[]) => Expression {
  return (ctx: Context, numbering: number[]) => {
    if (sliceStart > numbering.length) {
      throw new Error(
        `Cannot render the following numbering with sliceStart ${sliceStart}: [${
          numbering.join(", ")
        }]`,
      );
    }

    if (sliceEnd !== undefined && sliceEnd > numbering.length) {
      throw new Error(
        `Cannot render the following numbering with sliceEnd ${sliceEnd}: [${
          numbering.join(", ")
        }]`,
      );
    }

    const actualNumbering = numbering.slice(sliceStart, sliceEnd);

    const ret: Expression[] = [];
    actualNumbering.forEach((num, i) => {
      if (i > 0) {
        ret.push(renderBetween(ctx, i + sliceStart - 1));
      }

      ret.push(renderNumber(ctx, num));
    });

    return <fragment exps={ret} />;
  };
}

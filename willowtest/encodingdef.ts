import { table, td, th, tr } from "../h.ts";
import { marginale } from "../marginalia.ts";
import { Expression, Invocation, new_macro } from "../tsgen.ts";

export class Bitfields {
  rows: BitfieldRow[];

  constructor(...rows: BitfieldRow[]) {
    this.rows = rows;
  }
}

export class BitfieldRow {
  count: number;
  def: Expression;
  remark?: Expression;

  constructor(count: number, def: Expression, remark?: Expression) {
    this.count = count;
    this.def = def;
    this.remark = remark;
  }
}

export function encodingdef(
  ...rows: (([Expression, Expression?]) | Bitfields)[]
): Expression {
  const clearfix = { style: "clear:right;" };
  const macro = new_macro(
    (args, _ctx) => {
      const the_rows: Expression[] = [];

      let args_counter = 0;
      let hasRemarks = false;
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        if (row instanceof Bitfields) {
          the_rows.push(tr(
            th({ class: "bitCount" }, "Bit"),
            th("Big-endian bitfield"),
          ));

          for (let j = 0; j < row.rows.length; j++) {
            const cells: Expression[] = [
              td({ class: "bitCount" }, args[args_counter]),
            ];

            const def_body: Expression[] = [args[args_counter + 1]];
            args_counter += 2;

            if (row.rows[j].remark) {
              def_body.unshift(marginale(args[args_counter]));
              args_counter += 1;
              hasRemarks = true;
            }

            cells.push(td({ class: "bitDef" }, def_body));
            the_rows.push(tr({
              class: 'bitfieldDef',
              ...clearfix
            }, cells));
          }
        } else {
          const def_body: Expression[] = [args[args_counter]];
          args_counter += 1;

          if (row.length == 2 && row[1]) {
            def_body.unshift(marginale(args[args_counter]));
            args_counter += 1;
            hasRemarks = true
          }

          the_rows.push(tr({
            class: "bytesDef",
            ...clearfix
          }, td({ colspan: "2" }, def_body)));
        }
      }

      return table(
        { class: hasRemarks ? "encodingdef withremarks" : "encodingdef withoutremarks" },
        the_rows,
      );
    },
  );

  const the_args: Expression[] = [];
  let bit_counter = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (row instanceof Bitfields) {
      for (let j = 0; j < row.rows.length; j++) {
        const field_row = row.rows[j];
        if (field_row.count === 1) {
          the_args.push(`${bit_counter}`);
        } else if (field_row.count === 2) {
          the_args.push(
            `${bit_counter}, ${bit_counter + field_row.count - 1}`,
          );
        } else {
          the_args.push(
            `${bit_counter} – ${bit_counter + field_row.count - 1}`,
          );
        }
        bit_counter += field_row.count;

        the_args.push(field_row.def);

        if (field_row.remark) {
          the_args.push(field_row.remark);
        }
      }
    } else {
      the_args.push(row[0]);
      if (row.length == 2 && row[1]) {
        the_args.push(row[1]);
      }
    }
  }
  return new Invocation(macro, the_args);
}

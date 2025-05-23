import { Context, Expression, Expressions, expressions } from "./deps.ts";

/**
 * `\href{id}{children}`
 */
export function MHref(
  { url, children }: { url: Expression; children?: Expressions },
): Expression {
  return (
    <>
      {`\\href{`}
      {url}
      {`}{`}
      <exps x={children} />
      {`}`}
    </>
  );
}

/**
 * `\htmlId{id}{children}`
 */
export function MId(
  { id, children }: { id: Expression; children?: Expressions },
): Expression {
  return (
    <>
      {`\\htmlId{`}
      {id}
      {`}{`}
      <exps x={children} />
      {`}`}
    </>
  );
}

/**
 * `\htmlClass{id}{children}`
 */
export function MClass(
  { clazz, children }: {
    clazz: Expression[] | Expression;
    children?: Expressions;
  },
): Expression {
  return (
    <>
      {`\\htmlClass{`}
      {spaceSeparated(clazz)}
      {`}{`}
      <exps x={children} />
      {`}`}
    </>
  );
}

/**
 * `\htmlData{foo=a bar=b}{children}`
 */
export function MData(
  { data, children }: {
    data: Record<string, Expression>;
    children?: Expressions;
  },
): Expression {
  const dataList: Expression[] = [];

  let first = true;
  for (const key in data) {
    if (first) {
      first = false;
    } else {
      dataList.push(", ");
    }
    dataList.push(key);
    dataList.push("=");
    dataList.push(data[key]);
  }

  return (
    <>
      {`\\htmlData{`}
      {<exps x={dataList} />}
      {`}{`}
      <exps x={children} />
      {`}`}
    </>
  );
}

function spaceSeparated(exps: Expression[] | Expression): Expression {
  if (Array.isArray(exps)) {
    const tmp: Expression[] = [];

    exps.forEach((exp, i) => {
      if (i !== 0) {
        tmp.push(" ");
      }
      tmp.push(exp);
    });

    return <exps x={tmp} />;
  } else {
    return exps;
  }
}

export function MBeginEnd({name, children}: {name: Expressions, children?: Expressions}): Expression {
  return <>
    \begin{"{"}<exps x={name}/>{"}"}
      <exps x={children}/>
    \end{"{"}<exps x={name}/>{"}"}
  </>;
}

export function MAlign({children}: {children?: Expressions}): Expression {
  return <MBeginEnd name="align*" children={children} />
}
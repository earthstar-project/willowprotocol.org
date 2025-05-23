import {
  Context,
  createSubstate,
  Expression,
  Expressions,
} from "macromaniajsx/jsx-runtime";
import { File } from "macromania-outfs";

type State = {
  contentAddressedFiles: string[]; // paths
  etags: Record<string, /* path */ string /* etag */>;
};

const [getState, _settate] = createSubstate<State>(() => ({
  contentAddressedFiles: [],
  etags: {},
}));

export function ServerOptimisations(
  { children }: { children: Expressions },
): Expression {
  return (
    <map
      fun={(rendered, ctx) => {
        const state = getState(ctx);

        return (
          <>
            <omnomnom>
              <File name="cachinginfo.json">
                {JSON.stringify(state)}
              </File>
            </omnomnom>
            {rendered}
          </>
        );
      }}
    >
      <exps x={children} />
    </map>
  );
}

export function addContentAddressedFile(ctx: Context, path: string) {
  const state = getState(ctx);
  state.contentAddressedFiles.push(path);
}

export function addEtag(ctx: Context, path: string, tag: string) {
  const state = getState(ctx);
  state.etags[path] = tag;
}

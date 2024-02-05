import * as z from "zod";
import { flow, map, get } from "lodash/fp";

const mapWithIndex = (map as any).convert({ cap: false });

const getErrorsForReactHookFormFromServerResponse = flow(
  get("errors"),
  mapWithIndex(({ path, message }: z.ZodIssue, index: number) => {
    return {
      name: path.join("."),
      error: { type: "custom", message },
      config: { shouldFocus: index === 0 },
    };
  }),
);

export default getErrorsForReactHookFormFromServerResponse;

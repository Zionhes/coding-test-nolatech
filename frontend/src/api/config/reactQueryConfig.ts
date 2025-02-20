import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 * 5,
    },
  },
});

export { queryClient };

/** Registering Global Error
 *  @link https://tanstack.com/query/latest/docs/framework/react/typescript#registering-a-global-error
 */

import "@tanstack/react-query";
import type { AxiosError } from "axios";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError;
  }
}

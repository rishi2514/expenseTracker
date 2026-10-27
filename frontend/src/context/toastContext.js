import { createContext } from "react";

// Kept in a plain .js file (no JSX) so it can be shared between the provider
// component and the `useToast` hook without tripping the fast-refresh lint rule.
export const ToastContext = createContext(null);

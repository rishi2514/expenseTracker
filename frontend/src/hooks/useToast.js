import { useContext } from "react";
import { ToastContext } from "../context/toastContext";

const NOOP = () => {};

/**
 * toast.success("Saved") / toast.error("Oops") / toast.info("Heads up")
 * Returns a safe no-op when used outside of the ToastProvider.
 */
export default function useToast() {
  const toast = useContext(ToastContext);
  return (
    toast || { success: NOOP, error: NOOP, info: NOOP, dismiss: NOOP }
  );
}

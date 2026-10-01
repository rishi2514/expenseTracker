import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoClose,
  IoInformationCircle,
} from "react-icons/io5";
import { ToastContext } from "../context/toastContext";

const TOAST_STYLES = {
  success: { Icon: IoCheckmarkCircle, tone: "text-semantic-success" },
  error: { Icon: IoAlertCircle, tone: "text-semantic-danger" },
  info: { Icon: IoInformationCircle, tone: "text-brand-primary" },
};

const ToastViewport = ({ toasts, onDismiss }) => (
  <div
    className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-6 sm:w-[380px]"
    aria-live="polite"
  >
    {toasts.map((toast) => {
      const { Icon, tone } = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
      return (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-light-border bg-white p-3.5 shadow-lg animate-toast-in"
        >
          <Icon className={`mt-0.5 shrink-0 text-xl ${tone}`} aria-hidden="true" />
          <p className="flex-1 text-sm leading-snug text-light-textPrimary">
            {toast.message}
          </p>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="rounded-md p-0.5 text-light-textMuted transition hover:bg-light-surfaceSecondary hover:text-light-textPrimary"
          >
            <IoClose aria-hidden="true" />
          </button>
        </div>
      );
    })}
  </div>
);

// Lightweight toast notifications — success / error / info with auto-dismiss.
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info") => {
      if (!message) return;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((current) => [
        ...current.slice(-3), // never show more than 4 at once
        { id, message, type },
      ]);
      const timer = setTimeout(() => {
        dismiss(id);
        timersRef.current = timersRef.current.filter((t) => t !== timer);
      }, 4000);
      timersRef.current.push(timer);
    },
    [dismiss]
  );

  useEffect(
    () => () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    },
    []
  );

  const toast = useMemo(
    () => ({
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
      info: (message) => push(message, "info"),
      dismiss,
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;

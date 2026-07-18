"use client";

import { createContext, useCallback, useEffect, useState, useContext } from "react";

const ToastContext = createContext(null);
const pendingToastKey = "legacyBridgePendingToast";

const savePendingToast = (message, variant) => {
  window.sessionStorage.setItem(pendingToastKey, JSON.stringify({ message, variant }));
};

export const showToast = (message, variant = "success") => {
  if (typeof window === "undefined") return;
  savePendingToast(message, variant);
  window.dispatchEvent(new CustomEvent("legacy-bridge:toast", { detail: { message, variant } }));
};

export const showToastAfterReload = (message, variant = "success") => {
  if (typeof window === "undefined") return;
  savePendingToast(message, variant);
};

export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [toastState, setToastState] = useState(null);
  const toast = useCallback((nextToast) => {
    setToastState(nextToast);
    window.setTimeout(() => setToastState(null), 4000);
  }, []);

  useEffect(() => {
    const handleToast = (event) => {
      window.sessionStorage.removeItem(pendingToastKey);
      toast(event.detail);
    };
    const pendingToast = window.sessionStorage.getItem(pendingToastKey);
    window.addEventListener("legacy-bridge:toast", handleToast);
    if (pendingToast) {
      window.sessionStorage.removeItem(pendingToastKey);
      let parsedToast;
      try {
        parsedToast = JSON.parse(pendingToast);
      } catch {
        parsedToast = { message: pendingToast, variant: "success" };
      }
      window.setTimeout(() => toast(parsedToast), 0);
    }
    return () => window.removeEventListener("legacy-bridge:toast", handleToast);
  }, [toast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {toastState && (
        <div className={`toast toast-${toastState.variant}`} role="status">
          <span>{toastState.message}</span>
          <button
            type="button"
            className="toast-close"
            aria-label="Close notification"
            onClick={() => setToastState(null)}
          >
            ×
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

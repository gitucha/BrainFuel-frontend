// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useRef, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    open: false,
    title: "",
    message: "",
    variant: "info", // "info" | "success" | "error"
  });
  const timeoutRef = useRef(null);

  const hideToast = useCallback(() => {
    setToast((t) => ({ ...t, open: false }));
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    ({ title = "", message = "", variant = "info", duration = 3000 }) => {
      setToast({ open: true, title, message, variant });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [hideToast]
  );

  const bgByVariant = {
    info: "bg-blue-600",
    success: "bg-green-600",
    error: "bg-red-600",
  };

  const bgClass = bgByVariant[toast.variant] || bgByVariant.info;

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {toast.open && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`max-w-sm w-full ${bgClass} text-white px-4 py-3 rounded-lg shadow-lg animate-toast-slide-in`}
          >
            {toast.title && (
              <p className="text-sm font-semibold">{toast.title}</p>
            )}
            {toast.message && (
              <p className="text-sm mt-1">{toast.message}</p>
            )}
          </div>

          <style>{`
            @keyframes toastSlideIn {
              from {
                transform: translateX(140%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            .animate-toast-slide-in {
              animation: toastSlideIn 0.3s ease-out;
            }
          `}</style>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

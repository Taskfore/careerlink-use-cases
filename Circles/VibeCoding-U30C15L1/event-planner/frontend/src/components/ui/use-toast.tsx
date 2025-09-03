import React from "react";

// Simple toast implementation using DOM manipulation

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

const toast = (options: ToastOptions) => {
  const {
    title = "",
    description = "",
    variant = "default",
    duration = 5000,
  } = options;

  // Create toast element
  const toast = document.createElement("div");
  const toastId = `toast-${Date.now()}`;

  // Set toast classes based on variant
  const baseClasses = "fixed top-4 right-4 p-4 rounded shadow-lg z-50 max-w-sm";
  const variantClasses =
    variant === "destructive"
      ? "bg-red-500 text-white"
      : "bg-white text-gray-900 border border-gray-200";

  toast.className = `${baseClasses} ${variantClasses}`;
  toast.id = toastId;

  // Add title if provided
  if (title) {
    const titleEl = document.createElement("h3");
    titleEl.className = "font-medium";
    titleEl.textContent = title;
    toast.appendChild(titleEl);
  }

  // Add description if provided
  if (description) {
    const descEl = document.createElement("p");
    descEl.className = "text-sm";
    descEl.textContent = description;
    toast.appendChild(descEl);
  }

  // Add close button
  const closeBtn = document.createElement("button");
  closeBtn.className =
    "absolute top-2 right-2 text-current opacity-50 hover:opacity-100";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  };
  toast.appendChild(closeBtn);

  // Add to DOM
  document.body.appendChild(toast);

  // Auto-dismiss if duration is set
  if (duration > 0) {
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, duration);
  }

  return toastId;
};

// For backward compatibility
export { toast };
export const useToast = () => ({ toast });
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

export const Toaster = () => null;

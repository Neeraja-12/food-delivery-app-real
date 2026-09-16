
import { useState, useEffect } from 'react';

// Type definitions
export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
};

type ToastActionType = 
  | { type: 'ADD_TOAST'; toast: ToastProps }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToastProps> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId: string }
  | { type: 'REMOVE_TOAST'; toastId: string };

// Create a toast store
const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000;

const toasts: ToastProps[] = [];
let listeners: ((toasts: ToastProps[]) => void)[] = [];

function dispatch(action: ToastActionType) {
  switch (action.type) {
    case "ADD_TOAST":
      toasts.push(action.toast);
      if (toasts.length > TOAST_LIMIT) {
        toasts.shift();
      }
      break;
    
    case "UPDATE_TOAST":
      const { id, ...data } = action.toast;
      const toastIndex = toasts.findIndex((t) => t.id === id);
      if (toastIndex !== -1) {
        toasts[toastIndex] = { ...toasts[toastIndex], ...data };
      }
      break;
      
    case "DISMISS_TOAST": {
      const toastIndex = toasts.findIndex((t) => t.id === action.toastId);
      if (toastIndex !== -1) {
        toasts[toastIndex] = { ...toasts[toastIndex], duration: 0 };
      }
      break;
    }
      
    case "REMOVE_TOAST": {
      const toastIndex = toasts.findIndex((t) => t.id === action.toastId);
      if (toastIndex !== -1) {
        toasts.splice(toastIndex, 1);
      }
      break;
    }
  }

  listeners.forEach((listener) => {
    listener(toasts);
  });
}

// Toast functions
export function toast(props: Omit<ToastProps, "id">) {
  const id = crypto.randomUUID();
  const duration = props.duration || 5000;

  const newToast: ToastProps = {
    id,
    duration,
    ...props,
  };

  dispatch({ type: "ADD_TOAST", toast: newToast });

  return {
    id,
    dismiss: () => dispatch({ type: "DISMISS_TOAST", toastId: id }),
    update: (props: Partial<ToastProps>) =>
      dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } }),
  };
}

toast.dismiss = (toastId: string) => {
  dispatch({ type: "DISMISS_TOAST", toastId });
};

// Hook
export function useToast() {
  const [state, setState] = useState<ToastProps[]>(toasts);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((listener) => listener !== setState);
    };
  }, []);

  return {
    toasts: state,
    toast,
    dismiss: (toastId: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

import { ref, markRaw, type Component } from 'vue';
import Toast from '@/components/toast/Toast.vue';

export type ToastPosition =
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';

interface ToastOptions {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    position?: ToastPosition;
}

interface ToastInstance extends ToastOptions {
    id: number;
    component: Component;
}

const toasts = ref<ToastInstance[]>([]);
let toastId = 0;

export function useToast() {
    const show = (options: ToastOptions) => {
        const id = toastId++;
        const toast: ToastInstance = {
            id,
            component: markRaw(Toast),
            message: options.message,
            type: options.type,
            duration: options.duration,
            position: options.position || 'top-center'
        };

        toasts.value.push(toast);
        return id;
    };

    const close = (id: number) => {
        const index = toasts.value.findIndex(toast => toast.id === id);
        if (index > -1) {
            toasts.value.splice(index, 1);
        }
    };

    const success = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
        return show({ message, type: 'success', ...options });
    };

    const error = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
        return show({ message, type: 'error', ...options });
    };

    const info = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
        return show({ message, type: 'info', ...options });
    };

    const warning = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
        return show({ message, type: 'warning', ...options });
    };

    return { toasts, show, close, success, error, info, warning};
}
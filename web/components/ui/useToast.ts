import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
    message: string;
    type: ToastType;
};

export function useToast() {
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        setToast({ message, type });

        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
            setToast(null);
        }, 3000);
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return {
        toast,
        showToast,
        hideToast,
    };
}

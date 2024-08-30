"use client";

import { nanoid } from "nanoid";
import type { Toast } from "react-hot-toast";
import { Toaster, toast } from "react-hot-toast";
import { FcInfo } from "react-icons/fc";

export function ToastNotificationDisplay() {
    return (
        <Toaster
            position="bottom-left"
            toastOptions={{
                style: {
                    backgroundColor: "hsl(var(--secondary))",
                    color: "hsl(var(--secondary-foreground))",
                    border: "1px",
                    borderColor: "var(--border)",
                },
            }}
        />
    );
}

export class ToastNotification {
    public toastId;
    private defaultOptions: Partial<Toast> = {};

    constructor(id?: string, defaultOptions?: Partial<Toast>) {
        this.toastId = id || nanoid();
        this.defaultOptions = defaultOptions || {};
    }

    success(message: string, options?: Partial<Toast>) {
        toast.success(message, {
            id: this.toastId,
            iconTheme: { primary: "#38A169", secondary: "#ffffff" },
            ...this.defaultOptions,
            ...options,
        });
    }

    info(message: string, options?: Partial<Toast>) {
        toast(message, {
            id: this.toastId,
            icon: <FcInfo />,
            ...this.defaultOptions,
            ...options,
        });
    }

    error(message: string, options?: Partial<Toast>) {
        toast.error(message, {
            id: this.toastId,
            ...this.defaultOptions,
            ...options,
        });
    }

    loading(message: string, options?: Partial<Toast>) {
        toast.loading(message, {
            id: this.toastId,
            ...this.defaultOptions,
            ...options,
        });
    }

    remove() {
        toast.dismiss(this.toastId);
    }
}

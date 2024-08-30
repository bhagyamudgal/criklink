import { cn } from "@/lib/utils";
import React from "react";

type CenterProps = React.ComponentProps<"div">;

export function Center({ children, className, ...props }: CenterProps) {
    return (
        <div
            className={cn("flex items-center justify-center", className)}
            {...props}
        >
            {children}
        </div>
    );
}

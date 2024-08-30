import { cn } from "@/lib/utils";

export function Container({
    children,
    className,
}: {
    children: React.ReactNode | React.ReactElement;
    className?: string;
}) {
    return <div className={cn("w-full p-4 lg:p-6", className)}>{children}</div>;
}

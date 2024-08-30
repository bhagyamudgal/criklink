import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"section">;

export function Container({ children, className, ...props }: ContainerProps) {
    return (
        <section className={cn("w-full p-4 lg:p-6", className)} {...props}>
            {children}
        </section>
    );
}

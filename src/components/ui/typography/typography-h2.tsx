import { cn } from "@/lib/utils";

type TypographyH1Props = React.ComponentProps<"h2">;

export function TypographyH2({
    children,
    className,
    ...props
}: TypographyH1Props) {
    return (
        <h1
            className={cn("scroll-m-20 text-3xl font-semibold", className)}
            {...props}
        >
            {children}
        </h1>
    );
}

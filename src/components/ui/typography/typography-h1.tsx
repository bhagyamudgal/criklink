import { cn } from "@/lib/utils";

type TypographyH1Props = React.ComponentProps<"h1">;

export function TypographyH1({
    children,
    className,
    ...props
}: TypographyH1Props) {
    return (
        <h1
            className={cn(
                "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
                className
            )}
            {...props}
        >
            {children}
        </h1>
    );
}

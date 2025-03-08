import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted", className)} // Applying the passed className with default styles
            {...props} // Spread the remaining props
        />
    );
}

export { Skeleton };

import { cn } from "@/lib/utils";

interface ContainerProps extends React.ComponentProps<"div"> {
  size?: "default" | "wide" | "narrow";
}

export function Container({
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "default" && "max-w-7xl",
        size === "wide" && "max-w-[1400px]",
        size === "narrow" && "max-w-3xl",
        className
      )}
      {...props}
    />
  );
}

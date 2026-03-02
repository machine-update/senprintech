import * as React from "react";

type BadgeVariant = "default" | "outline";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClass: Record<BadgeVariant, string> = {
  default: "bg-slate-900 text-white",
  outline: "border border-slate-300 text-slate-700 bg-white",
};

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const classes = [
    "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold",
    variantClass[variant],
    className,
  ].join(" ");

  return <span className={classes} {...props} />;
}


import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    const classes = [
      "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none",
      "focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
      className,
    ].join(" ");

    return <input ref={ref} className={classes} {...props} />;
  }
);

Input.displayName = "Input";


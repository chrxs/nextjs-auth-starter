import React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      data-lpignore="true"
      ref={ref}
      {...props}
      className={cn("rounded border border-current p-2", className)}
    />
  );
});

Input.displayName = "Input";

export default Input;

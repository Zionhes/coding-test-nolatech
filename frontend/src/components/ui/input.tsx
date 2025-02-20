import { cn } from "@/libs/cn";
import * as React from "react";

import { useFormContext } from "react-hook-form";
import InputErrorMessage from "../InputErrorMessage";

function Input({ name = "genericName", className, ...props }: React.ComponentProps<"input">) {
  const {
    register,
    formState: { errors },
    getFieldState,
  } = useFormContext();
  const { invalid } = getFieldState(name);

  return (
    <div className="relative w-full">
      <input
        {...register(name)}
        id={name}
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded border bg-white px-3 py-1 text-base shadow transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        {...props}
      />

      <InputErrorMessage name={name} errors={errors} isInputInvalid={invalid} />
    </div>
  );
}

export { Input };

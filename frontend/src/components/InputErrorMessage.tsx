/*
 * It's mandatory render this component inside a relative parent
 * */

import { motion, AnimatePresence } from "framer-motion";
import { ErrorMessage } from "@hookform/error-message";
import type { FieldErrors, FieldValues } from "react-hook-form";

import { cn } from "@/libs/cn";
import { inputErrorMotion } from "@/libs/framer-motion/inputErrorMotion";

type InputErrorMessageProps = {
  name: string;
  errors: FieldErrors<FieldValues>;
  isInputInvalid: boolean;
  className?: string;
};

export default function InputErrorMessage({ errors, name = "", isInputInvalid, className }: InputErrorMessageProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {isInputInvalid && (
        <motion.div
          className={cn(
            "absolute right-3 -bottom-3.5 -z-10 flex h-3.5 w-fit items-center justify-center gap-1 rounded-b border border-t-0 border-red-500 bg-red-500 px-1.5 pt-[1px]",
            className,
          )}
          {...inputErrorMotion}
        >
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => <span className="text-xs text-white">{message}</span>}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

{
  /* {...inputErrorMotion} */
}

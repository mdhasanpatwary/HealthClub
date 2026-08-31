"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  showPasswordToggle?: boolean
}

function Input({ className, type, showPasswordToggle = true, disabled, ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const isPassword = type === "password"

  if (isPassword && showPasswordToggle) {
    return (
      <div className="relative w-full">
        <InputPrimitive
          type={showPassword ? "text" : "password"}
          data-slot="input"
          disabled={disabled}
          className={cn(
            "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 pr-9 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
            className,
            "pr-9"
          )}
          {...props}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-md transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50 select-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={0}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
        </button>
      </div>
    )
  }

  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      disabled={disabled}
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function PasswordInput(props: Omit<InputProps, "type">) {
  return <Input type="password" {...props} />
}

export { Input, PasswordInput }


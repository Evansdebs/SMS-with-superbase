import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50",
    destructive: "border-transparent bg-rose-500 text-white hover:bg-rose-500/80",
    outline: "text-slate-950 border border-slate-200 dark:text-slate-50 dark:border-slate-800",
    success: "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30",
    warning: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30",
    info: "border-transparent bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }

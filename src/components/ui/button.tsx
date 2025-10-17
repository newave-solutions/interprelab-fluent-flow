import { cn } from "../../lib/utils";

export function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn("px-4 py-2 rounded bg-green-600 text-white", className)} {...props}>
      {children}
    </button>
  );
}
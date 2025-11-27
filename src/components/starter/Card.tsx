import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

const Card = ({ children, className, title }: CardProps) => {
  return (
    <div className={cn(
      "rounded-xl bg-neutral-800 border border-neutral-700 p-6",
      className
    )}>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;
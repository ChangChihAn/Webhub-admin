import React from 'react';

// Utility for class names
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// --- ATOMS ---

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}
export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-slate-900 text-white shadow hover:bg-slate-800",
    secondary: "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200",
    outline: "border border-slate-200 bg-transparent shadow-sm hover:bg-slate-100 hover:text-slate-900",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 py-2",
    lg: "h-10 rounded-md px-8",
  };

  return (
    <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />
  );
};

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

// Card Components
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("rounded-xl border border-slate-200 bg-white text-slate-950 shadow", className)} {...props} />
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

// Badge
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}
export const Badge: React.FC<BadgeProps> = ({ variant = 'default', className, ...props }) => {
  const variants = {
    default: "border-transparent bg-slate-900 text-slate-50 shadow hover:bg-slate-900/80",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    destructive: "border-transparent bg-red-500 text-slate-50 shadow hover:bg-red-500/80",
    outline: "text-slate-950 border-slate-200 border",
    success: "border-transparent bg-green-500 text-white hover:bg-green-600",
    warning: "border-transparent bg-amber-500 text-white hover:bg-amber-600",
  };
  return (
    <div className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props} />
  );
};
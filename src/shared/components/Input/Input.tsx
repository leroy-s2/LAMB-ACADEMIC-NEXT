import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'glass';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full py-3 font-medium outline-none transition';
  
  const variantClasses = {
    default: 'px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-0',
    glass: 'rounded-full border border-white bg-transparent focus:bg-white/40 text-white placeholder-white/80 focus:ring-2 focus:ring-blue-200'
  };
  
  const iconPadding = leftIcon ? 'pl-12' : rightIcon ? 'pr-12' : 'px-4';
  const classes = `${baseClasses} ${variantClasses[variant]} ${iconPadding} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
            {leftIcon}
          </div>
        )}
        <input className={classes} {...props} />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
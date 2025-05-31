import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}
const Input = ({
  label,
  error,
  fullWidth = false,
  className = '',
  id,
  ...props
}: InputProps) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const baseStyles = 'block rounded-md shadow-sm border-gray-300 focus:ring-[#008401] focus:border-[#008401] sm:text-sm';
  const errorStyles = error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : '';
  const widthStyles = fullWidth ? 'w-full' : '';
  return <div className={fullWidth ? 'w-full' : ''}>
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>}
      <input id={inputId} className={`${baseStyles} ${errorStyles} ${widthStyles} ${className}`} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>;
};
export default Input;
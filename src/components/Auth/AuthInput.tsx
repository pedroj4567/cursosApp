// components/auth/AuthInput.tsx
import { useState } from "react";

type AuthInputProps = {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  name?: string;
  validate?: (value: string) => string | undefined;
};

export const AuthInput = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  name,
}: AuthInputProps) => {
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <div className="mb-4">
      <label className="block text-xs sm:text-sm md:text-base text-gray-700 mb-1 sm:mb-2 font-medium">
        {label}
      </label>
      <input
        type={type}
        className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
          error && touched ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        name={name}
      />
      {error && touched && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

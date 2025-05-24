import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  disabled = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder || "Enter password"}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{ paddingRight: 30 }}
        className={`w-full rounded border p-2 ${disabled ? "cursor-not-allowed bg-gray-100" : ""}`}
      />
      <span
        onClick={() => {
          if (!disabled) setShowPassword(!showPassword);
        }}
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: disabled ? "not-allowed" : "pointer",
          color: "#555",
          userSelect: "none",
          opacity: disabled ? 0.5 : 1,
        }}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
}

import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
}

export function Input({
  type,
  placeholder,
  name,
  register,
  rules,
  error,
}: InputProps) {
  return (
    <div>
      <input
        className="w-full border-2 border-slate-300 bg-white outline-[#c0261c] h-11 rounded-md px-2 placeholder:text-gray-300"
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
      />
      {error && (
        <p className="my-1 ml-2 text-sm text-red-500 text-start">{error}</p>
      )}
    </div>
  );
}

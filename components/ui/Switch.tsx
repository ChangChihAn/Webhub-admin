import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 flex items-center rounded-full p-1 transition ${
        checked ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default Switch;

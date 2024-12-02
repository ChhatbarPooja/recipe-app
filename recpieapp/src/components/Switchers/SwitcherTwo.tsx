import React from 'react';

interface SwitcherTwoProps {
  status: boolean;
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const SwitcherTwo: React.FC<SwitcherTwoProps> = ({ status, setStatus }) => {
  const handleChange = () => {
    setStatus(!status);
  };

  return (
    <div>
      <div x-data="{ switcherToggle: false }">
        <label
          htmlFor="toggle2"
          className="flex cursor-pointer select-none items-center"
        >
          <div className="relative">
            <input
              id="toggle2"
              type="checkbox"
              className="sr-only"
              checked={status}
              onChange={handleChange}
            />
            <div className="h-5 w-14 rounded-full bg-bodydark shadow-inner dark:bg-[#5A616B]"></div>
            <div
              className={`dot absolute left-0 -top-1 h-7 w-7 rounded-full bg-green-900 shadow-switch-1 transition ${
                status && '!right-0 !translate-x-full !bg-green-900 dark:!bg-white'
              }`}
            ></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default SwitcherTwo;

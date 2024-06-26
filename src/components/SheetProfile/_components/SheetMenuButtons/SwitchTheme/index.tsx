import React from 'react';
import Switcher from './Switcher';

const SwitchTheme = () => {
  return (
    <div className="flex gap-2 items-center px-2 py-1 cursor-pointer hover:bg-primary-500/70 dark:hover:bg-dark-5 transition">
      <div className="w-6 flex justify-center items-center"></div>
      <div className="flex-auto">Night Theme</div>
      <Switcher />
    </div>
  );
};

export default SwitchTheme;

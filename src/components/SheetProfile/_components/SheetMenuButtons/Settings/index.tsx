import { useTheme } from 'next-themes';
import Image from '@/components/Image';
import React from 'react';

const Settings = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className="flex gap-2 p-2 items-center cursor-pointer hover:bg-primary-500/70 dark:hover:bg-dark-5 transition">
      <div className="w-6">
        {isDark ? (
          <Image
            width={24}
            height={24}
            className="fill-dark-5 dark:fill-light-2 stroke-dark-5 dark:stroke-light-2 "
            src="/assets/icons/settings-light.svg"
            alt="settings"
          />
        ) : (
          <Image
            width={24}
            height={24}
            className="fill-dark-5 dark:fill-light-2 stroke-dark-5 dark:stroke-light-2 "
            src="/assets/icons/settings-dark.svg"
            alt="settings"
          />
        )}
      </div>
      <div>Settings</div>
    </div>
  );
};

export default Settings;

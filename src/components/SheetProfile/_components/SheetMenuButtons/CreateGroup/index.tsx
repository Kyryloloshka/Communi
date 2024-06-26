import { useTheme } from 'next-themes';
import React from 'react'

const CreateGroup = () => {
	const { theme } = useTheme();
  const isDark = theme === 'dark';
	return (
    <div className="flex gap-1 py-1 items-center pl-1 cursor-pointer hover:bg-primary-500/70 dark:hover:bg-dark-5 transition">
      <div className="w-8 flex justify-center items-center">
        {isDark ? (
          <img
            className="fill-dark-5 dark:fill-light-2 stroke-dark-5 dark:stroke-light-2"
            src="/assets/icons/group-light.svg"
            alt="settings"
          />
        ) : (
          <img
            className="fill-dark-5 dark:fill-light-2 stroke-dark-5 dark:stroke-light-2"
            src="/assets/icons/group-dark.svg"
            alt="settings"
          />
        )}
      </div>
      <div>Create Group</div>
    </div>
  );
}

export default CreateGroup

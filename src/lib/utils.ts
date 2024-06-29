import { TimeType } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: TimeType) {
  if (!timestamp) return;
  // Отримуємо поточний час в мілісекундах
  const currentTime = Date.now();
  // Отримуємо час Timestamp в мілісекундах
  const timestampTime = timestamp.seconds * 1000;

  // Різниця між поточним часом і часом Timestamp у мілісекундах
  const difference = currentTime - timestampTime;

  // Перевірка, чи Timestamp був недавно (менше ніж хвилина)
  if (difference < 60000) {
    return 'recently';
  }

  // Перевірка, чи Timestamp був недавно (менше ніж година)
  if (difference < 3600000) {
    const minutes = Math.floor(difference / 60000);
    return `${minutes} min. ago`;
  }

  // Перевірка, чи Timestamp був недавно (менше ніж день)
  if (difference < 86400000) {
    const hours = Math.floor(difference / 3600000);
    return `${hours} h. ago`;
  }

  // Перевірка, чи Timestamp був недавно (менше ніж тиждень)
  if (difference < 604800000) {
    const days = Math.floor(difference / 86400000);
    return `${days} d. ago`;
  }

  // Якщо Timestamp відбувся більше тижня тому, повертаємо дату та час
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000,
  );
  return date.toLocaleDateString(); // Повертаємо дату у звичайному форматі
}

export function formatFileSize(size: number) {
  if (size < 1024) {
    return size + ' bytes';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
}

export function formatFileTitle(title: string | undefined) {
  if (!title) return 'Untitled';
  if (title.length > 23) {
    const firstPart = title.slice(0, 10);
    const lastPart = title.slice(-10);
    return firstPart + '...' + lastPart;
  }
  return title;
}

export const getValidTime = (time: any) => {
  const date = new Date(time * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

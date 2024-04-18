import { type ClassValue, clsx } from "clsx"
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp: Timestamp) {
  if (!timestamp) return;
  // Отримуємо поточний час в мілісекундах
  const currentTime = Date.now();
  // Отримуємо час Timestamp в мілісекундах
  const timestampTime = timestamp.toMillis();

  // Різниця між поточним часом і часом Timestamp у мілісекундах
  const difference = currentTime - timestampTime;

  // Перевірка, чи Timestamp був недавно (менше ніж хвилина)
  if (difference < 60000) {
      return 'Recently';
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
  const date = timestamp.toDate();
  return date.toLocaleDateString(); // Повертаємо дату у звичайному форматі
}
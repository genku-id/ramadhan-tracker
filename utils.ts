import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fixed start date: Feb 19, 2025
// Month is 0-indexed (0=Jan, 1=Feb). So (2025, 1, 19) is Feb 19, 2025.
const START_DATE = new Date(2025, 1, 19); 

export const getRamadhanDate = (dayNum: number): string => {
  const date = new Date(START_DATE);
  date.setDate(START_DATE.getDate() + (dayNum - 1));
  
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    weekday: 'short'
  });
};

export const getGregorianDateString = (): string => {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  });
};

export const getCurrentRamadhanDay = (): number => {
  const now = new Date();
  const start = new Date(START_DATE);
  
  // Reset both to midnight (00:00:00) to strictly compare calendar dates
  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const oneDay = 1000 * 60 * 60 * 24;
  const diffTime = now.getTime() - start.getTime();
  
  // Use floor to ensure we don't round up prematurely
  const diffDays = Math.floor(diffTime / oneDay);
  
  // diffDays = 0 means it is Feb 19 (Day 1)
  const currentDay = diffDays + 1;

  if (currentDay < 1) return 1;
  if (currentDay > 30) return 30;
  return currentDay;
};

export const triggerConfetti = () => {
  const duration = 500;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // @ts-ignore
    window.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    // @ts-ignore
    window.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
  }, 250);
};

export const triggerMiniConfetti = (x: number, y: number) => {
    // Normalize coordinates to 0-1 range
    const xNorm = x / window.innerWidth;
    const yNorm = y / window.innerHeight;

    // @ts-ignore
    window.confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: yNorm, x: xNorm },
        colors: ['#10B981', '#F59E0B', '#34D399'],
        disableForReducedMotion: true,
        zIndex: 1000,
    });
};
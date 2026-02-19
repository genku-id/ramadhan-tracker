export type DailyTaskType = 'puasa' | 'tarawih' | 'tadarus' | 'lailatulQodar';

export const DAILY_TASK_TYPES: DailyTaskType[] = ['puasa', 'tarawih', 'tadarus']; // Base tasks
export const LAST_10_DAYS_TASK: DailyTaskType = 'lailatulQodar';

export const TASK_LABELS: Record<DailyTaskType, string> = {
  puasa: 'Puasa',
  tarawih: 'Tarawih',
  tadarus: 'Tadarus',
  lailatulQodar: 'L. Qodar'
};

export interface DayProgress {
  puasa: boolean;
  tarawih: boolean;
  tadarus: boolean;
  lailatulQodar: boolean;
}

export interface UserData {
  daily: Record<number, DayProgress>;
  zakat: boolean;
}

export interface AppState {
  faizal: UserData;
  ainun: UserData;
}

export type Person = 'faizal' | 'ainun';
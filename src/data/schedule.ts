export type ScheduleItem = {
  id: string;
  title: string;
  date: string;
  location?: string;
  note?: string;
};

export const scheduleSourceUrl = process.env.NEXT_PUBLIC_SCHEDULE_SOURCE_URL ?? "";

export const scheduleItems: ScheduleItem[] = [];

export declare const ROW_HEIGHT = 64;
export declare function formatMonthTitle(date: Date): string;
export declare function compareMonth(date1: Date | number, date2: Date | number): 0 | 1 | -1;
export declare function compareDay(day1: Date | number, day2: Date | number): 0 | 1 | -1;
export declare function getDayByOffset(date: Date, offset: number): Date;
export declare function getPrevDay(date: Date): Date;
export declare function getNextDay(date: Date): Date;
export declare function getToday(): Date;
export declare function calcDateNum(date: [Date, Date]): number;
export declare function copyDates(dates: Date | Date[]): Date | Date[];
export declare function getMonthEndDay(year: number, month: number): number;
export declare function getMonths(minDate: number, maxDate: number): number[];

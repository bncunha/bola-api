import { compareAsc, sub, add, differenceInDays, format } from 'date-fns';
import ja from 'date-fns/locale/ja/index';

export class DateUtils {

  static compare(data1: Date, data2: Date) {
    return compareAsc(data1, data2);
  }

  static subtract(data: Date, duration: any) {
    return sub(data, duration);
  }

  static add(date: Date, duration: any) {
    return add(date, duration);
  }

  static difference(date1: Date, date2: Date, dif: 'days' = 'days') {
    return differenceInDays(date1, date2);
  }

  static formatSql(date: Date) {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }

  static format(date: Date, fomat: string) {
    return format(date, fomat);
  }
}
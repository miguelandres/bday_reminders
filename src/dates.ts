// Copyright (c) 2025 Miguel Barreto and others
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import isBefore from 'dayjs/plugin/isSameOrBefore';
import { Date } from './types';

export const dateMovedToThisYearIsBeforeToday = (
  date: Date,
  today: dayjs.Dayjs = dayjs()
): boolean => {
  dayjs.extend(isLeapYear);
  dayjs.extend(isBefore);
  const dateDayJs = dayjs(`${date.year}-${date.month}-${date.day}`);
  const todayCleaned = dayjs(
    `${today.year()}-${today.month() + 1}-${today.date()}`
  );

  const dateThisYear = dateDayJs.year(today.year());
  return dateThisYear.isBefore(todayCleaned);
};

export const calculateAgeAtNextBirthday = (
  birthDate: Date | undefined,
  today: dayjs.Dayjs = dayjs()
): number | undefined => {
  if (!birthDate || !('year' in birthDate)) {
    return undefined;
  }
  if (dateMovedToThisYearIsBeforeToday(birthDate, today)) {
    return today.year() - birthDate.year! + 1;
  }
  return today.year() - birthDate.year!;
};

export const isBirthdayToday = (
  birthDate: Date | undefined,
  today: dayjs.Dayjs = dayjs()
): boolean => {
  dayjs.extend(isLeapYear);
  if (!birthDate) {
    return false;
  }
  // Special case for leap year birthdays
  if (birthDate.month === 2 && birthDate.day === 29) {
    if (today.isLeapYear()) {
      // Note day.js months are 0-based, ugh.
      return today.date() === 29 && today.month() + 1 === 2;
    } else {
      // Note day.js months are 0-based, ugh.
      // In non-leap years, consider Feb 29 birthdays to be on Feb 28
      return today.date() === 28 && today.month() + 1 === 2;
    }
  }
  return (
    birthDate.day === today.date() &&
    // Note day.js months are 0-based, ugh.
    birthDate.month === today.month() + 1
  );
};

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
import {
  dateMovedToThisYearIsBeforeToday,
  calculateAgeAtNextBirthday,
  isBirthdayToday,
} from '../src/dates';

describe('dates', () => {
  describe('dateMovedToThisYearIsBeforeToday', () => {
    it('Returns true if before today', () => {
      expect(
        dateMovedToThisYearIsBeforeToday(
          { year: 1900, month: 1, day: 15 },
          dayjs('2022-01-20')
        )
      ).toBe(true);
    });
    it('Returns false if after today', () => {
      expect(
        dateMovedToThisYearIsBeforeToday(
          { year: 1900, month: 1, day: 15 },
          dayjs('2022-01-13')
        )
      ).toBe(false);
    });
    it('Returns true if today is a month after', () => {
      expect(
        dateMovedToThisYearIsBeforeToday(
          { year: 1900, month: 1, day: 15 },
          dayjs('2022-02-15')
        )
      ).toBe(true);
    });
    it('Returns false if today is same day', () => {
      expect(
        dateMovedToThisYearIsBeforeToday(
          { year: 1900, month: 1, day: 15 },
          dayjs('2022-01-15')
        )
      ).toBe(false);
    });

    it('Returns false if date was Feb 29 and today Feb 28 on a non-leap year', () => {
      expect(
        dateMovedToThisYearIsBeforeToday(
          { year: 1904, month: 2, day: 29 },
          dayjs('2022-02-28')
        )
      ).toBe(false);
    });

    it('Returns true if date was Feb 29 and today March 1st on a non-leap year', () => {
      expect(
        dateMovedToThisYearIsBeforeToday(
          { year: 1904, month: 2, day: 29 },
          dayjs('2022-03-01')
        )
      ).toBe(true);
    });

    it('Returns false if date was Feb 29 and today Feb 29 on a leap year', () => {
      expect(
        dateMovedToThisYearIsBeforeToday(
          { year: 1904, month: 2, day: 29 },
          dayjs('2024-02-29')
        )
      ).toBe(false);
    });
  });

  describe('calculateAgeAtNextBirthday', () => {
    it('Returns undefined if no birth date', () => {
      expect(calculateAgeAtNextBirthday(undefined)).toBeUndefined();
    });
    it('Returns undefined if no year in birth date', () => {
      expect(calculateAgeAtNextBirthday({ month: 1, day: 15 })).toBeUndefined();
    });
    it('Returns current age if birthday is today', () => {
      expect(
        calculateAgeAtNextBirthday(
          { year: 2000, month: 1, day: 15 },
          dayjs('2001-01-15T10:00:00Z')
        )
      ).toBe(1);
    });
    it("Birthday hasn't happened this year", () => {
      expect(
        calculateAgeAtNextBirthday(
          { year: 2000, month: 1, day: 15 },
          dayjs('2001-01-10')
        )
      ).toBe(1);
    });
    it('Birthday already happened, +1 year', () => {
      expect(
        calculateAgeAtNextBirthday(
          { year: 2000, month: 1, day: 15 },
          dayjs('2001-01-16')
        )
      ).toBe(2);
    });
    it('handles leap year birthdays on non-leap years', () => {
      expect(
        calculateAgeAtNextBirthday(
          { year: 2000, month: 2, day: 29 },
          dayjs('2001-02-28')
        )
      ).toBe(1);
    });

    describe('isBirthdayToday', () => {
      it('Returns false if no birth date', () => {
        expect(isBirthdayToday(undefined)).toBe(false);
      });
      it('Returns true if today is the birthday', () => {
        expect(
          isBirthdayToday(
            { year: 2000, month: 1, day: 15 },
            dayjs('2001-01-15')
          )
        ).toBe(true);
      });

      it('Returns true if today is the birthday even after hours', () => {
        expect(
          isBirthdayToday(
            { year: 2000, month: 1, day: 15 },
            dayjs('2001-01-15T17:30:00Z')
          )
        ).toBe(true);
      });
      it('Returns false if today is not the birthday', () => {
        expect(
          isBirthdayToday(
            { year: 2000, month: 1, day: 15 },
            dayjs('2001-01-14')
          )
        ).toBe(false);
      });
      it('Returns true if birthday is Feb 29 and today is Feb 29 on a leap year', () => {
        expect(
          isBirthdayToday(
            { year: 2000, month: 2, day: 29 },
            dayjs('2024-02-29')
          )
        ).toBe(true);
      });
      it('Returns true if birthday is Feb 29 and today is Feb 28 on a non-leap year', () => {
        expect(
          isBirthdayToday(
            { year: 2000, month: 2, day: 29 },
            dayjs('2023-02-28')
          )
        ).toBe(true);
      });
    });
  });
});

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
  chooseBestBirthday,
  convertGooglePerson,
  getPeopleWithUpcomingBirthdays,
} from '../src/google_contacts';
import { Person } from '../src/types';

describe('Google Contacts', () => {
  describe('chooseBestBirthday', () => {
    it('Returns undefined if no birthdays', () => {
      expect(chooseBestBirthday(undefined)).toBeUndefined();
      expect(chooseBestBirthday([])).toBeUndefined();
    });
    it('Returns undefined if no valid birthdays', () => {
      expect(
        chooseBestBirthday([
          { date: {} },
          { date: { year: 2000 } },
          { date: { month: 1 } },
        ])
      ).toBeUndefined();
    });
    it('Returns birthday with year if available', () => {
      expect(
        chooseBestBirthday([
          { date: { month: 1, day: 1 } },
          { date: { year: 2000, month: 2, day: 2 } },
        ])
      ).toEqual({ year: 2000, month: 2, day: 2 });
    });
    it('Returns first birthday without year if no birthday with year', () => {
      expect(
        chooseBestBirthday([
          { date: { month: 1, day: 1 } },
          { date: { month: 2, day: 2 } },
        ])
      ).toEqual({ month: 1, day: 1 });
    });
  });

  describe('convertGooglePerson', () => {
    it('Converts a Google Person to internal Person representation', () => {
      const googlePerson: GoogleAppsScript.People.Schema.Person = {
        names: [{ displayName: 'John Doe' }],
        birthdays: [{ date: { year: 2000, month: 1, day: 15 } }],
      };
      const internalPerson = convertGooglePerson(
        googlePerson,
        dayjs('2001-01-10')
      );
      expect(internalPerson).toEqual(
        new Person('John Doe', { year: 2000, month: 1, day: 15 }, 1)
      );
    });

    it('Converts a Google Person keeping the best birthday', () => {
      const googlePerson: GoogleAppsScript.People.Schema.Person = {
        names: [{ displayName: 'John Doe' }],
        birthdays: [
          { date: { year: 2000, month: 1, day: 15 } },
          { date: { month: 2, day: 15 } },
        ],
      };
      const internalPerson = convertGooglePerson(
        googlePerson,
        dayjs('2001-01-10')
      );
      expect(internalPerson).toEqual(
        new Person('John Doe', { year: 2000, month: 1, day: 15 }, 1)
      );
    });

    it('Converts a Google Person without a good birthday', () => {
      const googlePerson: GoogleAppsScript.People.Schema.Person = {
        names: [{ displayName: 'John Doe' }],
        birthdays: [{ date: { day: 15 } }],
      };
      const internalPerson = convertGooglePerson(
        googlePerson,
        dayjs('2024-01-10')
      );
      expect(internalPerson).toEqual(
        new Person('John Doe', undefined, undefined)
      );
    });
  });
  describe('getPeopleWithUpcomingBirthdays', () => {
    it('Filters people with birthdays in the next N days', () => {
      const people = [
        new Person('Alice', { year: 2000, month: 1, day: 15 }, 24),
        new Person('Bob', { year: 1995, month: 1, day: 16 }, 29),
        new Person('Charlie', { year: 1988, month: 2, day: 1 }, 36),
      ];

      const peopleWithUpcomingBirthdays = getPeopleWithUpcomingBirthdays(
        people,
        2,
        dayjs('2024-01-15')
      );
      expect(peopleWithUpcomingBirthdays).toEqual(
        new Map<string, Person[]>([
          [
            '2024-01-15',
            [new Person('Alice', { year: 2000, month: 1, day: 15 }, 24)],
          ],
          [
            '2024-01-16',
            [new Person('Bob', { year: 1995, month: 1, day: 16 }, 29)],
          ],
        ])
      );
    });
    it('Handles leap year birthdays correctly', () => {
      const people = [
        new Person('Leap Year Baby', { year: 2024, month: 2, day: 29 }, 1),
      ];
      const peopleWithUpcomingBirthdays = getPeopleWithUpcomingBirthdays(
        people,
        1,
        dayjs('2025-02-28') // 2024 is a leap year
      );
      expect(peopleWithUpcomingBirthdays).toEqual(
        new Map<string, Person[]>([
          [
            '2025-02-28',
            [
              new Person(
                'Leap Year Baby',
                { year: 2024, month: 2, day: 29 },
                1
              ),
            ],
          ],
        ])
      );
    });
    it('handles year-end wrap around', () => {
      const people = [
        new Person('New Year Baby', { year: 2020, month: 1, day: 1 }, 5),
      ];
      const peopleWithUpcomingBirthdays = getPeopleWithUpcomingBirthdays(
        people,
        2,
        dayjs('2024-12-31')
      );
      expect(peopleWithUpcomingBirthdays).toEqual(
        new Map<string, Person[]>([
          ['2024-12-31', []],
          [
            '2025-01-01',
            [new Person('New Year Baby', { year: 2020, month: 1, day: 1 }, 5)],
          ],
        ])
      );
    });
    it('Returns empty map if no upcoming birthdays', () => {
      const people = [
        new Person('Alice', { year: 2000, month: 1, day: 15 }, 24),
      ];
      const peopleWithUpcomingBirthdays = getPeopleWithUpcomingBirthdays(
        people,
        1,
        dayjs('2024-02-01')
      );
      expect(peopleWithUpcomingBirthdays).toEqual(
        new Map<string, Person[]>([['2024-02-01', []]])
      );
    });
  });
});

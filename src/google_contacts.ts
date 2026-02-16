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
import { calculateAgeAtNextBirthday, isBirthdayToday } from './dates.js';
import type { Date } from './types.js';
import { Person } from './types.js';

export const chooseBestBirthday = (
  birthdays: GoogleAppsScript.People.Schema.Birthday[] | undefined
): Date | undefined => {
  if (!birthdays || birthdays.length === 0) {
    return undefined;
  }
  const validBirthdays = birthdays
    .map(bday => bday.date)
    .filter(date => date !== undefined)
    .filter(date => date.month && date.day);
  if (validBirthdays.length === 0) {
    return undefined;
  }
  // Prefer birthdays with year information
  const birthdaysWithYear = validBirthdays.filter(
    date => date.year !== undefined
  );
  if (birthdaysWithYear.length > 0) {
    return {
      year: birthdaysWithYear[0]!.year!,
      month: birthdaysWithYear[0]!.month!,
      day: birthdaysWithYear[0]!.day!,
    };
  }
  return {
    month: validBirthdays[0]!.month!,
    day: validBirthdays[0]!.day!,
  };
};

export const convertGooglePerson = (
  person: GoogleAppsScript.People.Schema.Person,
  today: dayjs.Dayjs = dayjs()
): Person => {
  const bestBirthday = chooseBestBirthday(person.birthdays);
  const ageAtNextBirthday = calculateAgeAtNextBirthday(bestBirthday, today);
  return new Person(
    person.names?.[0]?.displayName ?? 'No Name',
    bestBirthday,
    ageAtNextBirthday
  );
};

export const getPeopleWithUpcomingBirthdays = (
  people: Person[],
  daysAhead: number,
  today: dayjs.Dayjs = dayjs()
): Map<string, Person[]> => {
  const result = new Map<string, Person[]>();
  for (let i = 0; i < daysAhead; i++) {
    const date = today.add(i, 'day');
    const dateKey = date.format('YYYY-MM-DD');
    const peopleWithBirthdaysOnDate = people
      .filter(person => isBirthdayToday(person.birthday, date))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
    result.set(dateKey, peopleWithBirthdaysOnDate);
  }
  return result;
};

/**
 * Gets all the contacts from the Google People API, 500 at a time, and
 * aggregates them in a single in-memory array.
 *
 * Run on corp accounts at your own risk.
 *
 * @param personFields Fields to request, see https://developers.google.com/people/api/rest/v1/people.connections/list
 * @returns All contacts in your google account as Google Apps Script Person
 * objects, with only the `personFields` filled.
 */

export const getAllContacts = (
  personFields: string[] = ['names', 'birthdays']
): GoogleAppsScript.People.Schema.Person[] => {
  let nextPageToken: string | undefined = undefined;
  let allPeople: GoogleAppsScript.People.Schema.Person[] = [];
  do {
    const query: object = {
      pageToken: nextPageToken,
      pageSize: 500,
      personFields: personFields.join(','),
    };
    const response = People!.People!.Connections!.list('people/me', query);
    nextPageToken = response.nextPageToken;
    allPeople = allPeople.concat(response.connections!);
  } while (nextPageToken !== undefined);
  console.log(`found ${allPeople.length} contacts`);
  return allPeople;
};

/**
 * Gets all the contacts from the Google People API, 500 at a time, and
 * aggregates them in a single in-memory array and then filters them by the
 * filterFn criteria.
 *
 * Run on corp accounts at your own risk.
 *
 * @param filterFn a function that takes a Person object and returns true if the
 * object is to be kept in the array.
 * @param personFields Fields to request, see https://developers.google.com/people/api/rest/v1/people.connections/list
 * @returns All contacts in your google account that pass the filterFn as Google
 * Apps Script Person objects, with only the `personFields` filled.
 */

export const getFilteredContacts = (
  filterFn: (person: GoogleAppsScript.People.Schema.Person) => boolean,
  personFields: string[] = ['names', 'birthdays']
): GoogleAppsScript.People.Schema.Person[] => {
  const filteredContacts = getAllContacts(personFields).filter(filterFn);
  console.log(`found ${filteredContacts.length} people that pass the filter`);
  return filteredContacts;
};

/**
 * Get all contacts that have valid birthdays
 * @param additionalPersonFields Fields to request, additionally to names and
 * birthdays
 * @returns An array of contacts with birthdays (and the additional fields
 * requested)
 */
export const getAllContactsWithBirthdays = (
  additionalPersonFields: string[] = []
): GoogleAppsScript.People.Schema.Person[] => {
  const peopleWithBirthdays = getFilteredContacts(
    person =>
      // Clear people with no birthday arrays or undefined dates
      person.birthdays !== undefined &&
      // Clear people with undefined months or days
      person.birthdays!.filter(
        bday => bday.date?.day !== undefined && bday.date?.month !== undefined
      ).length > 0,
    additionalPersonFields.concat(['names', 'birthdays'])
  );
  console.log(`found ${peopleWithBirthdays.length} people with birthdays`);
  return peopleWithBirthdays;
};

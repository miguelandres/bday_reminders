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
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  convertGooglePerson,
  getPeopleWithUpcomingBirthdays,
  getAllContactsWithBirthdays,
} from './google_contacts';
import { Person } from './types';

const numberOfDaysAhead = 3;

function getContactsWithComingBirthdays(): Map<string, Person[]> {
  const people = getAllContactsWithBirthdays().map(person =>
    convertGooglePerson(person)
  );
  const peopleWithUpcomingBirthdays = getPeopleWithUpcomingBirthdays(
    people,
    numberOfDaysAhead
  );

  const countPeopleWithUpcomingBirthdays = Array.from(
    peopleWithUpcomingBirthdays.values()
  )
    .map(people => people.length)
    .reduce((a, b) => a + b, 0);

  console.log(
    `Found ${countPeopleWithUpcomingBirthdays} contacts with birthdays. `,
    Array.from(peopleWithUpcomingBirthdays.entries()).map(([date, people]) => [
      date,
      people.map(p => p.toString()).join(', '),
    ])
  );
  return peopleWithUpcomingBirthdays;
}

function onTrigger(): void {
  const peopleWithBirthdays: [string, Person[]][] = Array.from(
    getContactsWithComingBirthdays().entries()
  );

  if (
    peopleWithBirthdays
      .map(([_date, people]) => people.length)
      .reduce((a, b) => a + b, 0) === 0
  ) {
    console.log('No upcoming birthdays found.');
    return;
  }
  const dayDescriptors = ['today', 'tomorrow'];
  let message = '';
  for (let i = 0; i < numberOfDaysAhead; i++) {
    const [date, people] = peopleWithBirthdays[i];
    if (people.length > 0) {
      const dayDescriptor =
        i < dayDescriptors.length ? dayDescriptors[i] : `in ${i + 1} days`;
      message +=
        `## Birthdays ${dayDescriptor} (${date})` +
        `\n\n` +
        people.map(p => p.toString()).join(', ') +
        `\n\n`;
    }
  }
  console.log('Sending email with message:\n', message);
  const userEmail = Session.getEffectiveUser().getEmail();
  GmailApp.sendEmail(userEmail, 'Automated Birthday Reminder', message);
}

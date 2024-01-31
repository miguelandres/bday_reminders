// Copyright (c) 2024 Miguel Barreto and others
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

import dayjs from "dayjs";

export function namesOfPeopleWhoHaveBirthdaysOnDate(people: GoogleAppsScript.People.Schema.Person[], date: dayjs.Dayjs): string[] {
  return filterPeopleWhoHaveBirthdaysOnDate(people, date)
    .flatMap((person) => person.names)
    .filter((name): name is GoogleAppsScript.People.Schema.Name => !!name)
    .map((name) => name.displayName)
    .filter((name): name is string => !(name == null))
}

function filterPeopleWhoHaveBirthdaysOnDate(people: GoogleAppsScript.People.Schema.Person[], date: dayjs.Dayjs): GoogleAppsScript.People.Schema.Person[] {
  return people.filter((person) => personHasBirthdayOnDate(person, date))
}

function personHasBirthdayOnDate(person: GoogleAppsScript.People.Schema.Person, date: dayjs.Dayjs): boolean {
  const numMatchingBirthdays: number | undefined =
    person.birthdays?.filter((bday) =>
      bday.date?.day == date.date() &&
      // dayjs dates have 0-based months because that makes sense somehow.
      bday.date?.month == date.month() + 1
    )?.length
  if (typeof (numMatchingBirthdays) == "number") {
    return numMatchingBirthdays > 0
  }
  return false
}

function getAllContacts(): GoogleAppsScript.People.Schema.Person[] {
  let nextPageToken: string | undefined = undefined
  let allPeople: GoogleAppsScript.People.Schema.Person[] = []
  do {
    const query = {
      pageToken: nextPageToken,
      pageSize: 500,
      personFields: 'names,birthdays'
    }
    const response = People.People!.Connections!.list(
      'people/me',
      query)
    nextPageToken = response.nextPageToken
    allPeople = allPeople.concat(response.connections!)
  } while (nextPageToken != undefined)
  console.log(`found ${allPeople.length} contacts`)
  return allPeople
}

export function getAllContactsWithBirthdays(): GoogleAppsScript.People.Schema.Person[] {
  const peopleWithBirthdays = getAllContacts()
    // Clear people with no birthday arrays or undefined dates
    .filter((person) => person.birthdays != undefined)
    // Clear people with undefined months or days
    .filter((person) => person.birthdays!.filter((bday) => bday.date?.day != undefined && bday.date?.month != undefined))
  console.log(`found ${peopleWithBirthdays.length} people with birthdays`)
  return peopleWithBirthdays
}

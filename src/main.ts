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
import { getAllContactsWithBirthdays, namesOfPeopleWhoHaveBirthdaysOnDate }
  from "./PeopleQueries";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onTrigger() {

  const peopleWithBirthdays = getAllContactsWithBirthdays()

  const today: dayjs.Dayjs = dayjs()
  const tomorrow: dayjs.Dayjs = today.add(1, "d")
  console.log(`today is ${today.format()} and tomorrow is ${tomorrow.format()}`)

  const todayBirthdays =
    namesOfPeopleWhoHaveBirthdaysOnDate(peopleWithBirthdays, today)
  const tomorrowBirthdays =
    namesOfPeopleWhoHaveBirthdaysOnDate(peopleWithBirthdays, tomorrow)
  console.log(
    'Today birthdays: %s / Tomorrow Birthdays: %s',
    todayBirthdays, tomorrowBirthdays);
  if (todayBirthdays.length + tomorrowBirthdays.length > 0) {
    let message = ""
    if (todayBirthdays.length > 0)
      message += `## Birthdays Today (${today.format('YYYY-MM-DD')})` +
        `\n\n${ todayBirthdays.join(', ') } \n\n`
    if (tomorrowBirthdays.length > 0)
      message += `## Birthdays Tomorrow (${tomorrow.format('YYYY-MM-DD')})` +
        `\n\n${ tomorrowBirthdays.join(', ') } \n`
    console.log(`Sending this over email: \n\n${message}`)
    const userEmail = Session.getEffectiveUser().getEmail()
    GmailApp.sendEmail(userEmail, "Automated Birthday Reminder", message)
  }
}

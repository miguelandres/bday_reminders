
function test() {
	let nextPageToken: string | undefined = undefined
	let allPeople: GoogleAppsScript.People.Schema.Person[] = []
	do {
		let query = {
			pageToken: nextPageToken,
			pageSize: 500,
			personFields: 'names,birthdays'
		}
		let response = People.People!.Connections!.list(
			'people/me',
			query)
		nextPageToken = response.nextPageToken
		allPeople = allPeople.concat(response.connections!)
	} while (nextPageToken != undefined)
	var peopleWithBirthdays = allPeople.filter((person) => person.birthdays != undefined)


	console.log('Total contacts: %s / Contacts with birthdays: %s', allPeople.length, peopleWithBirthdays.length);

}

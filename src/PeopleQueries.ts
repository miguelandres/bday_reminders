
function test() {
	let nextPageToken: string | undefined = undefined
	let allPeople: GoogleAppsScript.People.Schema.Person[] = []
	while (nextPageToken == undefined) {
		var response = People.People!.Connections!.list(
			'people/me',
			{
				nextPageToken: nextPageToken,
				pageSize: 1000,
				personFields: 'names,birthdays'
			})
		nextPageToken = response.nextPageToken
		allPeople = allPeople.concat(response.connections!)
	}
	var peopleWithBirthdays = allPeople.filter((person) => person.birthdays != undefined)


	console.log('Total contacts: %s / Contacts with birthdays: %s', allPeople.length, peopleWithBirthdays.length);

}


function test() {
	var allPeople = People.People!.Connections!.list(
		'people/me',
		{
			pageSize: 1000,
			personFields: 'names,birthdays'
		}).connections!
	var peopleWithBirthdays = allPeople.filter((person) => person.birthdays != undefined)
	console.log('Total contacts: %s / Contacts with birthdays: %s', allPeople.length, peopleWithBirthdays.length);

}

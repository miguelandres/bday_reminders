
function test() {
	var peopleWithBirthdays = People.People?.Connections?.list(
		'people/me',
		{
			personFields: 'names,birthdays'
		}).connections?.filter((person) => person.birthdays != undefined)
	console.log('Connections: %s', JSON.stringify(peopleWithBirthdays, null, 2));

}

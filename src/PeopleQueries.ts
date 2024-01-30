
function test() {
	let peopleWithBirthdays = People.People?.Connections?.list(
		'people/me',
		{
			personFields: 'names,birthdays'
		});

}

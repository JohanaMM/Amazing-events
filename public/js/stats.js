let asyncStats = async function(){
	const response = await fetch(apiUrl);
    const dataRetr = await response.json().then( datos1 => {

        let datos = generateStats(datos1);
		
		
		const tableGeneralStats = document.getElementById("table-event-statistics")
		const tableUpcoming = document.getElementById("table-upcoming")
		const tablePast = document.getElementById("table-past")
		
		var tBodyGeneral = tableGeneralStats.getElementsByTagName('tbody')[0];
		var tBodyUpcoming = tableUpcoming.getElementsByTagName('tbody')[0];
		var tBodyPast = tablePast.getElementsByTagName('tbody')[0];
		
		let tableEventStatsString = `<tr>
		<td class="italic">Events with the highest percentage of attendance</td>
		<td class="italic">Events with the lowest percentage of attendance</td>
		<td class="italic">Event with larger capacity</td>
		</tr>
		`

		rowNumber = 1
		
		for (let index = 0; index < rowNumber; index++) {
			tableEventStatsString += `<tr>
			<td>${datos.maxPerc[index] !== "" ? datos.maxPerc[index].name : ""}</td>
			<td>${datos.minPerc[index] !== "" ? datos.minPerc[index].name : ""}</td>
			<td>${datos.maxCap[index] !== "" ? datos.maxCap[index].name : ""}</td>
			</tr>
			`			
		}

		tBodyGeneral.innerHTML = tableEventStatsString
		

		let tableUpcomingString = `					<tr>
		<td class="italic">Categories</td>
		<td class="italic">Revenues (estimated)</td>
		<td class="italic">Percentage of attendance (estimated)</td>
		</tr>`
		
		datos.upcoming.forEach( element => tableUpcomingString += `
		<tr>
			<td>${element.category}</td>
			<td>$${element.revenue}</td>
			<td>${element.avgPercentage.toFixed(2)}%</td>
		</tr>
		`)
		
		tBodyUpcoming.innerHTML = tableUpcomingString
		
		let tablePastString = `					<tr>
		<td class="italic">Categories</td>
		<td class="italic">Revenues</td>
		<td class="italic">Percentage of attendance</td>
		</tr>`

		datos.past.forEach( element => tablePastString += `
		<tr>
			<td>${element.category}</td>
			<td>$${element.revenue}</td>
			<td>${element.avgPercentage.toFixed(2)}%</td>
		</tr>
		`)
		tBodyPast.innerHTML = tablePastString
	})
}

asyncStats();

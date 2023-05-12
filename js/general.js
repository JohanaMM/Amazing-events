
let colorsSS = sessionStorage.getItem("colors");
if (colorsSS == null){
	sessionStorage.setItem("colors", false);
}

let colouredCards = sessionStorage.getItem("colors");

document.onkeydown = function (key){
	if(key.ctrlKey && key.which == 66){

		let dummy = sessionStorage.getItem("colors");
		let dummy2 = JSON.parse(dummy) === true;

		if(!dummy2){
			swal({
				title: "Colors enabled",
				text: "Just a moment...",
				icon: "success",
			});
		} else {
			swal({
				title: "Colors disabled",
				text: "Just a moment...",
				icon: "error",
			});
		}

		let millisecondsToWait = 1500;
		setTimeout(function(){
			window.location.reload();
		}, millisecondsToWait);

		sessionStorage.setItem("colors", !dummy2);
	}
}

// DATA SOURCES
let apiUrl = "https://mindhub-xj03.onrender.com/api/amazing"
let localData = "./json/amazing_1.json";

// Ir a detalles
function viewDetails(cardId) {
	window.location.href = `./Details.html?id=${cardId}`
}

// Estilo arreglos
let colorStyles = ["red", "blue", "green", "yellow", "orange", 
"magenta", "cyan", "purple", "white", "brown", "silver"];

// generar categorias
const categorySetGenerator = (allEvents) => {
	let categoriesSet = new Set();
	allEvents.forEach( evento => categoriesSet.add(evento.category) )																												// Return as an Array
	return categoriesSet;																																// Return as Set
}

const categorySetGenerator2 = (myObj) => {
	let categoriesSet = new Set();
	myObj.events.forEach( evento => categoriesSet.add(evento.category) )																												// Return as an Array
	return categoriesSet;																																// Return as Set
}


// CHECKBOXR
const checkBoxGenerator = (categoriesArray) => {

	let checkBoxHTML = `<div class="d-flex flex-wrap d-sm-flex my-1 gap-2">`;

	categoriesArray.forEach(categoria => 
		{ checkBoxHTML += `	<div class="form-check ms-2">
			<input type="checkbox" class="form-check-input" value="${categoria}" id="checkCat-${categoria}">
			<label class="form-check-label" for="checkCat-${categoria}">${categoria}</label>
			</div>`
		
		});

	checkBoxHTML += "</div>"
	return checkBoxHTML;
}


// card individual
function generateCard(evento, refDate, cardClassColor, withColour){

	return `<div class="mb-4 d-flex justify-content-center" onclick="viewDetails(${evento._id})">
	<div class="card ${withColour ? "card-".concat(cardClassColor) : ""} h-100">
		<img src="${evento.image}" class="card-img-top" alt="${evento.name} image">
		<div class="card-body">
		<h5 class="card-title text-center">${evento.name}</h5>
		<div class="d-flex mb-0 justify-content-evenly">
			<p class="card-price d-inline mb-0"><small>${evento.date}</small></p>
			<p class="card-price d-inline mb-0"><strong>$${evento.price}</strong></p>
		</div>
		<hr class="mb-2 mt-2">
			<p class="card-text mb-2">${evento.description}</p>
		</div>
		<div class="card-footer">
		<btn onclick="viewDetails(${evento._id})" class=${refDate >= evento.date ? '"btn btn-outline-secondary"':'"btn btn-outline-info"'} >View Details</btn>
		</div>
	</div>
</div>
`
}


// todas las cards
function generateCards(myObj, categoriesArray){

	let cardsHTML = `<div class="d-flex flex-wrap my-5 justify-content-around">`
	let withColors = JSON.parse(sessionStorage.getItem("colors")) === true;																																								//Discomment this line for no multiple colors

	if (myObj.events.length != 0){
		myObj.events.forEach((event) => {
			let colorStyle = colorStyles[categoriesArray.indexOf(event.category) % colorStyles.length]
			cardsHTML += generateCard(event, myObj.currentDate, colorStyle, withColors)
		})
	} else {
		cardsHTML += `<div class="d-flex flex-column"> <p class="text-center" style="color:white;font-size:3rem;">Oops, no coincidences!</p><p class="text-center" style="color:white;font-size:2rem;">Try adjusting your search parameters</p></div>`
	}
	return cardsHTML + `</div>`
}


// Filtros
function filterContent(my_object) {
	let categoriesFound = [];
	document.querySelectorAll(".form-check-input").forEach( e => {if(e.checked == true) 
        categoriesFound.push(e.value)})

	// Buscador
	let searchWord = document.getElementById("search").value.toLowerCase();
	let allCategoriesArray2 = [...categorySetGenerator2(my_object.currentTarget.myParam)]


	let filteredObj = filterByDate(my_object.currentTarget.myParam)																			
	let filteredEvents = filteredObj.events																																	//Initially, got all the events


	// Aplicar filtros
	if ( categoriesFound.length != 0){
		filteredEvents = filteredEvents.filter( evento => categoriesFound.includes(evento.category))
	}

	if (searchWord != ""){
		filteredEvents = filteredEvents.filter( evento => evento.name.toLowerCase().includes(searchWord))
	}

	// Rettornar objeto
	let filteredContent = {
		currentDate: my_object.currentTarget.myParam.currentDate,
		events: filteredEvents
	}

	const cards_div = document.getElementById("cartas");
	cards_div.innerHTML = generateCards(filteredContent, allCategoriesArray2);
}


function filterByDate(myObject) {

	let currentURL = window.location.href
	let eventsFilteredByDate = myObject.events
	if( currentURL.includes("upcoming")){
		eventsFilteredByDate = myObject.events.filter( e => e.date >= myObject.currentDate)
	} else if (currentURL.includes("past")){
		eventsFilteredByDate = myObject.events.filter( e => e.date < myObject.currentDate)
	}

	// Return object
	let filteredObj = {
		currentDate: myObject.currentDate,
		events: eventsFilteredByDate
	}

	return filteredObj;

}


function generateStats(myObject) {

	let capacitiesAll = []
	myObject.events.forEach(event => capacitiesAll.push(event.capacity))

	let majorCapacity = myObject.events.filter( event => event.capacity == Math.max(...capacitiesAll))

	let percentages = []
																																//ALL EVENTS
	myObject.events.filter(e => e.date < myObject.currentDate).forEach(event => percentages.push({												//ONLY PAST EVENTS
		_id: event._id,
		name: event.name,
		capacity: event.capacity,
		attendance: event.hasOwnProperty("assistance") ? event.assistance : event.estimate,
		percentage: (event.hasOwnProperty("assistance") ? event.assistance : event.estimate) / event.capacity * 100
	})) 


	let arrayMaximunAtt = percentages.filter(event => event.percentage == Math.max.apply(Math, percentages.map(event => event.percentage)))

	let arrayMinimunAtt = percentages.filter(event => event.percentage == Math.min.apply(Math, percentages.map(event => event.percentage)))

	let maxCapLenght = majorCapacity.length
	let maxAttLenght = arrayMaximunAtt.length
	let minAttLenght = arrayMinimunAtt.length

	let mayorLenght = Math.max(maxCapLenght, maxAttLenght, minAttLenght)

	let allCategories = [...categorySetGenerator(myObject.events)]

	let upcomingCategories = [...categorySetGenerator(myObject.events.filter( e => myObject.currentDate <= e.date))];
	let pastCategories = [...categorySetGenerator(myObject.events.filter( e => myObject.currentDate > e.date))];

	upcomingCategories = allCategories.filter(category => upcomingCategories.includes(category));
	pastCategories = allCategories.filter(category => pastCategories.includes(category));

	let upcomingEventsStats = []
	upcomingCategories.forEach( catName => upcomingEventsStats.push(generateCategoryStats2(catName, myObject.events.filter(event => myObject.currentDate <= event.date))) )			//Good Mode

	let pastEventsStats = []
	pastCategories.forEach( catName => pastEventsStats.push(generateCategoryStats2(catName, myObject.events.filter(event => myObject.currentDate > event.date))) )							//Good Mode

	// retornar objeto
	let allStats = {
		cota: mayorLenght,
		maxCap: majorCapacity,
		maxPerc: arrayMaximunAtt,
		minPerc: arrayMinimunAtt,
		upcoming: upcomingEventsStats,
		past: pastEventsStats
	}

	return allStats;

}


let generateCategoryStats = (categoryName, eventsArray) => {
	let categoryData = {
		category: categoryName,
		attendanceTotal: 0,
		capacityTotal: 0,
		revenue: 0,
	}

	eventsArray.filter( event => {if(event.category == categoryName) {
		categoryData.attendanceTotal += event.hasOwnProperty("assistance") ? event.assistance : event.estimate;
		categoryData.capacityTotal += event.capacity
		categoryData.revenue += (event.price * (event.hasOwnProperty("assistance") ? event.assistance : event.estimate) )
	}})

	return categoryData;

}


// For Good Mode
let generateCategoryStats2 = (categoryName, eventsArray) => {
	let categoryData = {
		category: categoryName,
		percentages: [],
		avgPercentage: "",
		revenue: 0,
	}

	eventsArray.filter( event => {if(event.category == categoryName) {
		categoryData.percentages.push((event.hasOwnProperty("assistance") ? event.assistance : event.estimate) / event.capacity * 100);
		categoryData.revenue += (event.price * (event.hasOwnProperty("assistance") ? event.assistance : event.estimate) );
	}})

	categoryData.avgPercentage = categoryData.percentages.reduce((a, b) => a + b) / categoryData.percentages.length

	return categoryData;

}

let modifyColorVariable = function (key){
	if(key.ctrlKey && key.which == 66){
		alert("Ctrl + B shortcut combination was pressed");
	}
}
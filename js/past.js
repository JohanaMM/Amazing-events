let asyncPast = async function(){

	const div_tarjetas = document.getElementById("cartas");
	while(div_tarjetas.firstChild) {div_tarjetas.removeChild(div_tarjetas.firstChild);}	 

	const div_checkboxes = document.getElementById("checkboxes")
	while(div_checkboxes.firstChild) { div_checkboxes.removeChild(div_checkboxes.firstChild);}
	try {

		const response = await fetch(apiUrl);
        const dataRetr = await response.json().then( apiEvents => {
	
		let allCategoriesArray = [...categorySetGenerator2(apiEvents)]

		div_tarjetas.innerHTML = generateCards(filterByDate(apiEvents), allCategoriesArray);							//Use this for only checkboxes with available categories
		div_checkboxes.innerHTML = checkBoxGenerator(allCategoriesArray);												//First (and unique) time rendering checkboxes


		const inputSearch = document.getElementById("search")
		inputSearch.addEventListener("input", filterContent)
		inputSearch.myParam = apiEvents;

		const otrosCheckboxes = document.querySelectorAll(".form-check-input")
		for (const checkbox of otrosCheckboxes) {
			checkbox.addEventListener("click", filterContent);
			checkbox.myParam = apiEvents;
		}
	})

	} catch (error) {
			console.log(error)
			const div_form = document.getElementById("div-formulario")
			div_form.className = "d-none"

			div_tarjetas.innerHTML = `<div class="d-flex flex-column"> <p class="text-center" style="color:white;font-size:3rem;">An error ocurred!</p>
			<p class="text-center" style="color:white;font-size:2rem;">Try in another moment</p></div>`		
	}
}

asyncPast();

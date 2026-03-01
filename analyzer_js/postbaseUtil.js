function addPostbase() {
	const cont = document.createElement("span");
	const select = document.createElement("select");
    const del = document.createElement("span");

	const container = document.getElementById("search_section")
	const nv = document.getElementById("noun_verb");
    cont.className = "cont";
	select.className = "input2";
	select.name = "postbase";
    del.title = "Delete Postbase";

	//populate the list's options from postbase array
	var optionArray = postBasesAll;
	for (var option in optionArray) {
		var newOption = document.createElement("option");
		newOption.value = optionArray[option];
		newOption.innerHTML = optionArray[option];
		select.options.add(newOption);
	}
    const x = document.createTextNode("x");
    del.setAttribute("class", "closeButton");
    del.setAttribute("onclick", "this.parentNode.remove(); return false;");
    del.appendChild(x);
    //del.innerHTML = '<span class="closeButton" name="close" onclick="this.parentNode.parentNode.remove(); return false;">x</span>'

	cont.appendChild(select);
    cont.appendChild(del);
	container.insertBefore(cont, nv);
	resize_Selects();
	select.dispatchEvent(new Event('change'));
}
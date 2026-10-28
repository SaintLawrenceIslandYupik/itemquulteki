function fomaPrintInvert(tkn, valid){

	var results = document.getElementById("results");
	var content = document.createElement("P");

	results.innerHTML = "";
	if(!valid) {
		results.innerHTML = "Unable to determine surface form."
	}

	else {
		document.getElementById("parse-container").style.display = "flex";
		for(i=0; i<tkn.length; i++){
			content.innerHTML = tkn[i];
			results.appendChild(content);
		}
	}
}

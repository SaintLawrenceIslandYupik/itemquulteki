//populate caseMood and perNum lists based on user input in noun_verb
function populate(s1, s2) {
		var slct1 = document.getElementById(s1);
		var slct2 = document.getElementById(s2);
		var optionArray;
		slct2.innerHTML = "";

		//handle caseMood list
		if(s2 == "caseMood"){
			if(slct1.value =="[N]"){
				optionArray = nounCase;
			}
			else if (slct1.value == "[V][Trns]" || slct1.value =="[V][Intr]"){
				optionArray = verbMood;
			}
		}
		//handle perNum list
		else if (s2 == "perNum") {
			if(slct1.value =="[N]"){
				optionArray = nounInfl;
			}
			else if(slct1.value =="[V][Trns]"){
				optionArray = verbInflTrns;
			}
			else if (slct1.value == "[V][Intr]"){
				optionArray = verbInflIntr;
			}
		}
		//populate list
		for(let option in optionArray){
			let newOption = document.createElement("option");
			newOption.value = optionArray[option];
			newOption.innerHTML = optionArray[option];
			slct2.options.add(newOption);
		}
		
		slct2.dispatchEvent(new Event('change'));
}

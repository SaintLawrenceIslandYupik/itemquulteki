//create class instance: const res = new resultList([parseHandler instance].parseResult(), [parseHandler instance].error, 50)
//if(res.error){
//res.errDisplay()
//}
//else {
//res.print()
//}
class resultList {
    //Class for resultList generalizes the print/output functions in foma_print.js
    result = document.getElementById("results");
    displayList = [];
    ptn = [
		"[V→V]",
		"[N→V]",
		"[V→N]",
		"[N→N]"
	];
    re = new RegExp(this.ptn.join("|"), "i");
    tknlen;
	printNResults;
    len = 0;

    constructor(parseList, errors, numResults) {
        this.parseList = this.sortResults(parseList);
        //this.parseList = parseList.sort((a, b) => a.length - b.length);;
        this.errors = errors;
        this.result.innerHTML = "";
        this.printNResults = numResults;
        //this.tknlen = parseList.length;
        document.getElementById("parse-container").style.display = "flex";
    }

    sortResults(parseList) {

        for(let i = 0; i < parseList.length; i++) {
            parseList[i].sort((a, b) => a.length - b.length);
        }
        
        return parseList;
        
    }

    //print formatted results dynamically
    print() {
        for (const [key, value] of Object.entries(this.parseList)) {
            this.result.appendChild(this.dropDown(key, value, Object.keys(this.parseList).indexOf(key), this.parseList[key].length));
        }
    }

    //assign anchor tags for dictionary links
    formatLinks(tknArray, p) {
        let final = [];
        for (let j = 0; j < this.prntNRslts(tknArray.length); j++) {
            if (j == 0) {
                let tempAnchor = document.createElement("a");
                tempAnchor.setAttribute("target", "_blank");
                tempAnchor.setAttribute("rel", "noopener noreferrer");
                tempAnchor.setAttribute("href", `https://dictionary.akuzipik.info/index.html?search=${tknArray[j].toLowerCase()}&lang=akuz`);
                tempAnchor.textContent = tknArray[j];
                p.appendChild(tempAnchor);
                //p.innerHTML += `<a target="_blank" rel="noopener noreferrer" href="https://dictionary.akuzipik.info/index.html?search=${tknArray[j].toLowerCase()}&lang=akuz">${tknArray[j]}</a>`;
            }
            else if (!tknArray[j].includes("→")) {
                final.push(tknArray[j]);
            }
            else {
                let tempAnchor = document.createElement("a");
                tempAnchor.setAttribute("target", "_blank");
                tempAnchor.setAttribute("rel", "noopener noreferrer");
                tempAnchor.setAttribute("href", `https://dictionary.akuzipik.info/index.html?search=-${tknArray[j].toLowerCase().replace(/[\@\–\-\+\?\±\%\:\₁]/g, "").replace(/\<su[bp]\>[\d*ef]\<\/su[bp]\>/g, "").replace(/\[.*\]/g,"").replace(/\~[sf]*/g, "").replace(/\(.*\)/g,"")}-&lang=akuz`);
                tempAnchor.textContent = tknArray[j];
                p.appendChild(tempAnchor);
                //p.innerHTML += `<a target="_blank" rel="noopener noreferrer" href="https://dictionary.akuzipik.info/index.html?search=-${tknArray[j].toLowerCase().replace(/[\@\–\-\+\?\±\%\:\₁]/g, "").replace(/\<su[bp]\>[\d*ef]\<\/su[bp]\>/g, "").replace(/\[.*\]/g,"").replace(/\~[sf]*/g, "").replace(/\(.*\)/g,"")}-&lang=akuz">${tknArray[j]}</a> + `;
            }
        }
        
        //append inflection and enclitics
        for (let k=0; k<final.length; k++) {
            let tempAnchor = document.createElement("p");
            tempAnchor.textContent = final[k];
            p.appendChild(tempAnchor);
        }
        return p;
    }

    dropDown(inputWord, parseList, index, totalParses) {
        let dropDown = document.createElement("details");
        if (index === 0) {
            dropDown.setAttribute("open", "true");
        }
        //Label with input word
        let summary = document.createElement("summary");
        summary.textContent = inputWord + ` (${totalParses})`;

        //Interrupt to display errors
        if (this.errors[inputWord]["error0"] !== undefined) {
            summary.textContent += ` Error: ${this.errors[inputWord]["error0"]["error"]}`;
            summary.style.color = "#6F1A07";
            dropDown.appendChild(summary);

            let message = document.createElement("p");
            message.textContent = this.errors[inputWord]["error0"]["message"]
            message.innerHTML += ` <span class="param">${this.errors[inputWord]["error0"]["param"]}</span>`;
            dropDown.appendChild(message);

            return dropDown;
        }
        
        dropDown.appendChild(summary);
        let container = document.createElement("div");
        container.classList.add("dropdown-content");
        for (let i = 0; i < parseList.length; i++) {
            let parse = document.createElement("div");
            parse.classList.add("parse");
            parse = this.formatLinks(parseList[i], parse);
            container.appendChild(parse);
        }
        dropDown.appendChild(container);
        return dropDown;
    }

    //download results to csv
    csvFormat() {

    }

    errDisplay() {
        this.result.innerHTML = this.errors;
    }

    prntNRslts(length) {
        return length<this.printNResults ? length : this.printNResults;
    }


        
    //print error if error
}
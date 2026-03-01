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

    constructor(parseList, error, numResults) {
        this.parseList = parseList.sort((a, b) => a.length - b.length);;
        this.error = error;
        this.result.innerHTML = "";
        this.printNResults = numResults;
        this.tknlen = parseList.length;
        document.getElementById("parse").style.display = "flex";
    }

    //print formatted results dynamically
    print() {
    }

    //assign anchor tags for dictionary links
    formatLinks(tkn, index) {

    }

    //download results to csv
    csvFormat() {

    }

    errDisplay() {
        this.result.innerHTML = this.error;
    }

    prntNRslts() {
        if (this.tknlen<this.printNResults){
			this.len=this.tknlen;
		}
		else{
			this.len=this.printNResults;
		}
    }


        
    //print error if error
}
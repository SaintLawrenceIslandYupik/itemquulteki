class resultsExport {

    constructor(type, wordsToParse, results, errors) {
        this.type = type;
        this.wordsToParse = wordsToParse;
        console.log("words to parse: ", this.wordsToParse);
        this.results = results;
        console.log("results: ", this.results);
        this.errors = errors;
        console.log("errors: ", this.errors);
    }

    export() {
        if (this.type === "tsv") {
            let tsvString = this.tsvExport();
            this.blobHandler(tsvString, 'text/tsv;charset=utf-8,\uFEFF');
        }
        else if (this.type === "json") {
            let jsonString = this.jsonExport();
            this.blobHandler(jsonString, 'application/json');
        }
        else if (this.type === "xml") {
            let xmlString = this.xmlExport();
            this.blobHandler(xmlString, 'application/xml');
        }
        else if (this.type === "pdf") {
            // Implement PDF export logic here
            // This is a placeholder for PDF export functionality
        }
        else {
            throw new Error("Unsupported export type");
        }
        // Add support for other file types as needed
    }

    blobHandler(dataString, type) {
        const blob = new Blob([dataString], { type: type });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `results_${this.wordsToParse.slice(0,2)}..._${new Date().toISOString().slice(0, 10)}.${this.type}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    tsvExport() {
        let tsvString = "";
        for (const word of this.wordsToParse) {
            //check for errors first
            console.log("errors for ", word, ": ", this.errors[word]);
            if(this.errors[word]["error0"] !== undefined) {
                tsvString += `${word}\t${Object.keys(this.errors[word]).length}\t`;
                for (const [key, value] of Object.entries(this.errors[word])) {
                    tsvString += `${value["error"]} ${value["message"]}${value["param"] !== undefined ? " "+value["param"] : ""}\t`;
                }
                tsvString = tsvString.slice(0, -1) + '\r\n';
            }
            else {
                tsvString += `${word}\t${this.results[word].length}\t`;
                for (const result of this.results[word]) {
                    tsvString += `${result.join('+')}\t`;
                }
                tsvString = tsvString.slice(0, -1) + '\r\n';
            }
        }
        return tsvString;
    }

    jsonExport() {
        let jsonString = '{"Results": [';
        for (const word of this.wordsToParse) {
            if(this.errors[word]["error0"] !== undefined) {
                jsonString += JSON.stringify({word: word, output: this.errors[word], total: Object.keys(this.errors[word]).length}) + ',';
            }
            else {
                jsonString += JSON.stringify({word: word, output: this.results[word], total: this.results[word].length}) + ',';
            }
        }
        jsonString = jsonString.slice(0, -1) + ']}';

        return jsonString;
    }

    xmlExport() {
        //set TEI encoding, maybe something like
        //<TEI>
        //  <entry>
        //      <w lemma="word">
        //          <m type="stem" msd="stem">qavagh</m>
        //          <m type="morph1" msd="[Intr][Ind][3Sg]">tuq</m>
        //      </w>
        //      <W>

        //  </entry>
        //</TEI>
    }
}
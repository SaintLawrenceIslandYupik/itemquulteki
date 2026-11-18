class resultsExport {
    constructor(type, wordsToParse, results, errors) {
            this.type = type;
            this.wordsToParse = wordsToParse;
            this.results = results;
            this.errors = errors;
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
        link.setAttribute('download', `results_${this.wordsToParse.slice(0,2)}...${new Date().toISOString().slice(0, 10).replace(/[-]/g, '_')}_${this.whichResults}.${this.type}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

}

class resultsExportParser extends resultsExport {

    constructor(type, wordsToParse, results, errors) {
        super(type, wordsToParse, results, errors);
        this.whichResults = document.querySelector('input[name="exportOption"]:checked')?.value;
        this.results = this.whichResults === "selected" ? this.getSelectedResults() : this.results;
    }

    getSelectedResults() {
        let selectedResults = {};
        // Implementation for getting selected results
        for (const word of this.wordsToParse) {
            let selectedChecks = document.querySelectorAll(`input[name="${word}"]:checked`);
            if (selectedChecks.length > 0) {
                selectedResults[word] = Array.from(selectedChecks).map(check => check.value);
            }
            else {
                selectedResults[word] = [];
            }
        }
        return selectedResults;
    }

    tsvExport() {
        let tsvString = "";
        for (const word of this.wordsToParse) {
            //check for errors first
            if(this.errors[word]["error0"] !== undefined) {
                tsvString += `${word}\t${Object.keys(this.errors[word]).length}\t`;
                for (const [key, value] of Object.entries(this.errors[word])) {
                    tsvString += `${value["error"]} ${value["message"]}${value["param"] !== undefined ? " "+value["param"] : ""}\t`;
                }
                tsvString = tsvString.slice(0, -1) + '\r\n';
            }
            else {
                if (this.whichResults === "selected") {
                    tsvString += `${word}\t${this.results[word].length}\t`;
                    tsvString += `${this.results[word].join('\t')}\t`;
                }
                else{
                    tsvString += `${word}\t${this.results[word].length}\t`;
                    for (const result of this.results[word]) {
                        tsvString += `${result.join('+')}\t`;
                    }
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
                if (this.whichResults === "selected") {
                    jsonString += JSON.stringify({word: word, output: this.results[word], total: this.results[word].length}) + ',';
                }
                else {
                    jsonString += JSON.stringify({word: word, output: this.results[word], total: this.results[word].length}) + ',';
                }
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

class resultsExportDictionary extends resultsExport {

    constructor(type, wordsToParse, results, errors) {
        super(type, wordsToParse, results, errors);
    }

    tsvExport() {
        let tsvString = "Headword\tGloss\tPart of Speech\tTags\tExamples\tIPA\tCyrillic\r\n";
        for (const word of Object.entries(this.results)) {
            tsvString += `${word.UUID}\t${word.gloss}\t${word.partOfSpeech}\t${word.tags.join(';')}\t${word.examples.join(';')}\t${word.ipa}\t${word.cyrillic}\r\n`;
        }
        return tsvString;
    }

    jsonExport() {
        return JSON.stringify(this.results);
    }

    xmlExport() {
        let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<results>\n';
        for (const word of Object.entries(this.results)) {
            xmlString += `  <result type="${word.UUID}">\n`;
            xmlString += `    <headword>${word.headword}</headword>\n`;
            xmlString += `    <gloss>${word.gloss}</gloss>\n`;
            xmlString += `    <partOfSpeech>${word.partOfSpeech}</partOfSpeech>\n`;
            xmlString += `    <tags>${word.tags.join(';')}</tags>\n`;
            xmlString += `    <examples>${word.examples.join(';')}</examples>\n`;
            xmlString += `    <ipa>${word.ipa}</ipa>\n`;
            xmlString += `    <cyrillic>${word.cyrillic}</cyrillic>\n`;
            xmlString += `  </result>\n`;
        }
        xmlString += '</results>';
        return xmlString;
    }

    pdfExport() {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            throw new Error('Unable to open print window');
        }

        printWindow.document.write(`
            <!doctype html>
            <html>
                <head>
                    <title>Search results</title>
                </head>
                <body>
                    <pre>${JSON.stringify(this.results, null, 2)}</pre>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }
}

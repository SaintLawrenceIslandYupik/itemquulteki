//const prs = new parseHandler(userInput, transducer)
//
class parseHandler {
    errs = ["Unable to parse.", "This is not a recognized Akuzipik spelling."]
    error;

    constructor(userInput, transducer) {
        this.userInput = userInput;
        this.transducer = transducer;
        this.parseList = this.controller(this.userInput, this.transducer);
    }

    //instanceName.parseResult() returns the morpheme-separated array of parses
    get parseResult() {
        return this.parseList;
    }

    //controller handles the parsing steps and sets this.parseList
    controller(userInput, transducer) {
        let result;
        if(!this.validate(userInput)){
            this.error = this.errs[1];
            return false;
        }
        else {
            const initialParse = foma_apply_down(transducer, userInput);
            if (initialParse === undefined || initialParse.length == 0){
                this.error = this.errs[0];
                return false;
             }
             else{
                 result = this.morphemizer(initialParse);
             }
        }
        
        return result;
    }

    //take in user input and validate with spellchecker
    validate(userInput) {
        if(!spellcheck(tokenize(userInput,false), ['i', 'a', 'u', 'e'], userInput.toLowerCase())){
            return false;
        }

        return true;
    }

    //break apart each index in the result array into component morphemes and return array of decomposed parses
    morphemizer(result) {
        let token = new Array;
        for (let i = 0; i < result.length; i++) {
        
            let morphemes = new Array;
        
            let inflNotSplit = result[i].split("-");
        
            let inflSplit = new Array;

            for (let m = 0; m < inflNotSplit.length; m++) {
                if (inflNotSplit[m].includes("[N]")) {
                    inflSplit = inflNotSplit[m].split("[N]");
                    tmp = morphemes.concat(inflSplit);
                    morphemes = tmp;
                }
                else if (inflNotSplit[m].includes("[V]")) {
                    inflSplit = inflNotSplit[m].split("[V]");
                    tmp = morphemes.concat(inflSplit);
                    morphemes = tmp;
                }
                else {
                    morphemes.push(inflNotSplit[m]);
                }
            }
            token.push(morphemes);
        }
        return token;
    }

    set err(error) {
        this.error = error;
    }
}
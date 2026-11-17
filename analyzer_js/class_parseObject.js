//const prs = new parseHandler(userInput, transducer)
//
class parseHandler {
    errs = {"parse": {
                "error": "Unable to parse.",
                "message": "The parser was unable to generate any results for this input. This may be due to a non-standard spelling or an incorrectly formed word.",
                "param": ""
            }, 
            "spelling": {
                "error": "Possible misspelling.",
                "message": "This may be a misspelling or a non-standard spelling of this word. Check that consonants are undoubled and vowels are properly lengthened where necessary.",
                "param": ""
            }, 
            "input": {
                "error": "Invalid input.",
                "message": "Contains non-Yupik characters.",
                "param": ""
            }
            };
    //errors = {};

    constructor(userInput, transducer) {
        this.userInput = this.cleanInput(userInput);
        this.transducer = transducer;  
        //maybe just always treat it as an array even if there is only one element
        this.wordsToParse = Array.isArray(this.userInput.split(" ")) ? this.userInput.split(" ") : [this.userInput];
        this.multiword = this.wordsToParse.length > 1 ? true : false;
        this.errors = {};
        for (let i=0; i<this.parseLength; i++) {
            this.errors[this.wordsToParse[i]] = {};
        }
        this.parseList = this.controller(this.wordsToParse, this.transducer);
        
        this.resultSortParam = "shortest";
    }

    cleanInput(input) {
        return input.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").toLowerCase().trim();
    }

    //controller handles the parsing steps and sets this.parseList
    controller(words, transducer) {``
        let result = {};
        this.validate(words);
        for (let i = 0; i < this.parseLength; i++) {
            let initialParse = foma_apply_down(transducer, words[i]);
            if (initialParse === undefined || initialParse.length == 0){``
                this.err(words[i], structuredClone(this.errs["parse"]));
                result[words[i]] = [initialParse];
            }
            else {
                result[words[i]] = this.morphemizer(initialParse);
            }
        }
        
        return result;
    }

    //take in user input and validate with spellchecker
    validate(words) {
        for (let i = 0; i < this.parseLength; i++) {
            //validate spelling conventions
            let spellcheckResult = spellcheck(tokenize(words[i], false), new Set(['i', 'a', 'u', 'e']), words[i].toLowerCase());
            if (!spellcheckResult.bool && spellcheckResult.spellingError) {
                this.err(words[i], structuredClone(this.errs["spelling"]), spellcheckResult.spellingError);
            }
            //Check for illegal characters
            if (!spellcheckResult.bool && spellcheckResult.illegalChar) {
                this.err(words[i], structuredClone(this.errs["input"]), `Illegal character(s) '${spellcheckResult.illegalChar.split("").join(", ")}' found in input.`);
            };
            //check for doubled consonants
            if (tokens_to_string(undouble(tokenize(words[i].toLowerCase(), false))) !== words[i].toLowerCase()) {
                this.err(words[i], structuredClone(this.errs["spelling"]), `Try undoubling the appropriate consonants like this: ${tokens_to_string(undouble(tokenize(words[i].toLowerCase(), false)))}`);
            }            
        }

        return;
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
                    let tmp = morphemes.concat(inflSplit);
                    morphemes = tmp;
                }
                else if (inflNotSplit[m].includes("[V]")) {
                    inflSplit = inflNotSplit[m].split("[V]");
                    let tmp = morphemes.concat(inflSplit);
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

    err(targetWord, error, paramValue) {
        //word: {errors : {error0 : {error : text, message: text, param: paramValue},  error1: {error : text, message: text, param: paramValue}}}
        let param = paramValue === undefined ? "" : paramValue;
        error["param"] = `${param}`;
        this.errors[targetWord]["error"+Object.keys(this.errors[targetWord]).length] = error;
    }

    //Getters and Setters
    //instanceName.parseResult() returns the morpheme-separated array of parses
    get parseResult() {
        return this.parseList;
    }

    get parseLength() {
        return this.multiword ? this.wordsToParse.length : 1;
    }

    get sortParam() {
        return this.resultSortParam;
    }

    set sortParam(param) {
        this.resultSortParam = param;
    }
}
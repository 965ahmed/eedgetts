class ProcessingFile {
    constructor(_file_name, _text, _FIRST_STRINGS_LENGTH, _LAST_STRINGS_LENGTH, _lang_lexx) {
        this.file_names = [];
        this.file_names.push([_file_name, 0]);
        this.FIRST_STRINGS_LENGTH = _FIRST_STRINGS_LENGTH;
        this.LAST_STRINGS_LENGTH = _LAST_STRINGS_LENGTH;
        this.full_text = _text;
        this.lang_lexx = _lang_lexx;
        this.pre_sentences = this.getFixPoints(this.full_text);
        this.all_sentences = this.get_fix_section(this.pre_sentences);
    }

    // SRT to TXT
    convertSrtToTxt(srtText) {
        const lines = srtText.trim().split("\n\n");  // Split blocks by double newlines
        let result = '';
        
        lines.forEach(block => {
            const parts = block.split("\n");
            if (parts.length >= 3) {
                const text = parts.slice(2).join(' '); // Combine all lines after the timestamp
                result += text + '\n';  // Add the extracted text to the result
            }
        });
        
        return result.trim();  // Return the combined text without extra whitespace
    }

    // Process text for various rules
    getFixPoints(text) {
        const result = [];
        let fix_text = text.replace(/[~\|\*\^]/g, "-");
        fix_text = fix_text.replace(/\\/g, "/");
        fix_text = fix_text.replace(/&/g, " and ");
        fix_text = fix_text.replace(/</g, "(");
        fix_text = fix_text.replace(/>/g, ")");

        // Apply lexicon rules
        if (this.lang_lexx.length > 0) {
            for (const rule of this.lang_lexx) {
                const match = rule.match(/^regex"(.*)"="(.*)"/);
                if (match) {
                    const regex = new RegExp(match[1], 'g');
                    const replacement = match[2].replace(/\\r/g, '\r').replace(/\\n/g, '\n');
                    fix_text = fix_text.replace(regex, replacement);
                } else if (rule.length > 0) {
                    if (rule[0] == '"') {
                        const match_arr = rule.trim().replaceAll('"', "").split("=");
                        if (match_arr.length == 2) {
                            fix_text = fix_text.replaceAll(match_arr[0].toString(), match_arr[1].toString());
                        }
                    } else {
                        const match_arr = rule.trim().split("=");
                        const regex = new RegExp('(^|\\s)' + match_arr[0].toString() + '(?=\\s|$)', 'gi');
                        fix_text = fix_text.replace(regex, '$1' + match_arr[1].toString());
                    }
                }
            }
        }

        if (pointsSelect.value !== 'Don\'t replace periods') {
            if (pointsSelect.value == 'Replace with three lines') {
                fix_text = fix_text.replace(/\./g, '\r\n\r\n\r\n\r\n');
            } else {
                const new_point = pointsSelect.value[pointsSelect.value.length - 1];
                if (pointsType.innerHTML === "V1") {
                    fix_text = fix_text.replace(/\./g, new_point);
                } else if (pointsType.innerHTML === "V2") {
                    fix_text = fix_text.replace(new RegExp('\\.[ \\t]{1,}\\n', 'g'), '.\n');
                    fix_text = fix_text.replace(new RegExp('\\.(?![\\r\\n])', 'g'), new_point);
                } else if (pointsType.innerHTML === "V3") {
                    fix_text = fix_text.replace(new RegExp('\\.[ \\t]{1,}\\n', 'g'), '.\n');
                    fix_text = fix_text.replace(new RegExp('\\.[ \\t]', 'g'), new_point + ' ');
                }
            }
        }

        const pointsList = fix_text.split('\n').filter(Boolean);
        return pointsList;
    }

    // Checks for pronounceable characters in text
    containsPronounceableChars(str) {
        return /[\p{L}\p{N}]/u.test(str);
    }

    // Process the sentences into smaller sections
    get_fix_section(sentences) {
        let result = [];
        let splitter = " ";
        let current_text = "";

        for (let i = 0; i < sentences.length; i++) {
            if (i > 2 && sentences[i].trim() !== "" && sentences[i-1].trim() === "" && sentences[i-2].trim() === "" && sentences[i-3].trim() === "" && this.containsPronounceableChars(current_text) === true) {
                current_text += "\n";
                if (current_text.length > 0) {
                    result.push(current_text);
                    current_text = '';
                }
            }
            let line = sentences[i];
            let words = line.split(splitter);
            for (let j = 0; j < words.length; j++) {
                let word = words[j];
                if (current_text.length + word.length > this.LAST_STRINGS_LENGTH && [".", ",", "!", "?", ":", ";", "-"].includes(word[word.length - 1])) {
                    result.push(current_text + splitter + word);
                    current_text = "";
                } else {
                    if (current_text.length > 0) {
                        current_text += splitter;
                    }
                    current_text += word;
                }
            }
            if (current_text.length > 0) {
                current_text += "\n";
            }
        }
        if (current_text.length > 0) {
            result.push(current_text);
        }
        return result;
    }

    // Add a new text block to the file
    addNewText(_file_name, _text) {
        this.file_names[this.file_names.length - 1][1] = this.all_sentences.length;
        this.file_names.push([_file_name, 0]);
        const pre_sentences = this.getFixPoints(_text);
        const new_sentences = this.get_fix_section(pre_sentences);
        this.all_sentences = [...this.all_sentences, ...new_sentences];
    }

    // Clear current processing data
    clear() {
        this.file_names.length = 0;
        this.file_names = [];
        this.file_names.push(["Книга", 0]);
        this.full_text = "";
        this.pre_sentences.length = 0;
        this.all_sentences.length = 0;
    }
		    }

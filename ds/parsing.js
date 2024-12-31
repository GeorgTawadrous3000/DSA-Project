// NOTE: this code assumes that the text within the xml tags can't contain the characters {'<', '>'} 
// and that {"&lt", "&gt"} are used to represent them respectively
//
//
// NOTE: this code uses 4 space characters to beautify instead of a single tab character
//
//
// NOTE: cases that are not handled in validate() & correct() functions
//          case 1 : if there is both an opening & closing tag in the same line with conflicting tag names
//                   ex: <tag_A> arbitrary text </tag_B>
//
//
// NOTE: cases that are not handled in beautify() function
//          case 1 : if there is text before/after an opening/closing tag
//                   ex: <tagA> arbitrary text
//                   ex: arbitrary text <tagA>
//                   ex: </tagA> arbitrary text
//                   ex: arbitrary text </tagA>


// implement the Stack Data Structure
class Stack {
    constructor() {
        this.items = [];
    }
    push(element) {
        this.items.push(element);
    }
    contains(element) {
        return this.items.includes(element);
    }
    pop() {
        if (!this.isEmpty()) return this.items.pop();
    }
    top() {
        if (!this.isEmpty()) return this.items[this.items.length - 1];
    }
    length() {
        return this.items.length;
    }
    isEmpty() {
        return this.items.length === 0;
    }
    clear() {
        this.items = [];
    }
    print() {
        console.log(this.items.toString());
    }
}

// implement the validate() function, returns boolean true/false
function validate(file_text = null) {
    if(file_text == null || file_text == "") return false;

    // split the file contents into lines
    var lines = file_text.replace(/\r\n/g, '\n').split('\n');

    // remove empty lines
    lines = lines.filter(element => element !== '');

    // use a stack for checking the validity of the xml
    // stack will only hold names of the opening tags
    const stack = new Stack();

    // validate the xml text
    for(var i = 0; i < lines.length; i++) {

        // remove leading/trailing spaces from the line
        lines[i] = lines[i].trim();

        // count num '<' in the line
        // the "|| []" is to ensure that result is 
        // always an array even if there are no matches
        let result = lines[i].match(/</g) || [];
        let num_matches = result.length;

        // if the line is a tag parse it 
        // else it is normal text so ignore it
        if(num_matches != 0) {

            // check if the tag is opening <...>, closing </...>, or both <...> </...>
            // simply check if num '<' in the line is 2 then both, thus we ignore this case
            // else if second character is '!' then it is comment and ignore it
            // else if second character is '?' then it is start tag, thus check if it is at the beginning of the file or not
            // else if second character is not '/' then opening
            // else it is closing
            if(num_matches == 2) {
                continue;
            }
            else if(lines[i][1] == '!') {
            }
            else if(lines[i][1] == '?') {
                if(i != 0) return false; 
            }
            else if(lines[i][1] != '/') {
                // Use a regular expression to extract the tag name, i.e. the word inside <...> or </...>
                let tag_name = lines[i].match(/<\/?(.*?)>/)[1];
                stack.push(tag_name);
            }     
            else {
                // Use a regular expression to extract the tag name, i.e. the word inside <...> or </...>
                let tag_name = lines[i].match(/<\/?(.*?)>/)[1];
                // check if the last tag in the stack has the same name then pop()
                // else that indicates that a conflict exists and thus the xml isn't valid
                if(stack.top() == tag_name) stack.pop();
                else return false;
            }
        }

    }

    // if stack isn't empty after parsing the whole file then that indicates that 
    // there is one or more opening tags without a closing tag and thus the xml isn't valid
    // else the xml file is valid and return true
    if(!stack.isEmpty()) return false;
    return true;
}

// implement the correct() function, returns string with corrected xml data
function correct(file_text = null) {
    if(file_text == null || file_text == "") return "";

    // create array to hold the corrected lines
    var lines_corrected = [];
    var length_corrected = 0;

    // split the file contents into lines
    var lines = file_text.replace(/\r\n/g, '\n').split('\n');

    // remove empty lines
    lines = lines.filter(element => element !== '');

    // use a stack for correcting the xml
    // stack will only hold names of the opening tags
    const stack = new Stack();

    // correct the xml text
    for(var i = 0; i < lines.length; i++) {

        // remove leading/trailing spaces from the line
        lines[i] = lines[i].trim();

        // count num '<' in the line
        // the "|| []" is to ensure that result is 
        // always an array even if there are no matches
        let result = lines[i].match(/</g) || [];
        let num_matches = result.length;

        // if the line is a tag parse it 
        // else it is normal text so add it as it is
        if(num_matches != 0) {

            // check if the tag is opening <...>, closing </...>, or both <...> </...>
            // simply check if num '<' in the line is 2 then both, thus we add the line to lines_corrected
            // else if second character is '!' then it is a comment, thus add it as it is
            // else if second character is '?' then it is a start tag, thus add it only if it is at the beginning of the file
            // else if second character is not '/' then opening, thus we push and add the line to lines_corrected
            // else it is closing, thus we correct errors (if any) then pop and add the line to lines_corrected
            if(num_matches == 2) {
                lines_corrected[length_corrected++] = lines[i];
                continue;
            }
            else if(lines[i][1] == '!') {
                lines_corrected[length_corrected++] = lines[i];
            }
            else if(lines[i][1] == '?') {
                if(i == 0) lines_corrected[length_corrected++] = lines[i];
            }
            else if(lines[i][1] != '/') {
                // Use a regular expression to extract the tag name, i.e. the word inside <...> or </...>
                let tag_name = lines[i].match(/<\/?(.*?)>/)[1];
                stack.push(tag_name);
                lines_corrected[length_corrected++] = lines[i];
            }     
            else {
                // Use a regular expression to extract the tag name, i.e. the word inside <...> or </...>
                let tag_name = lines[i].match(/<\/?(.*?)>/)[1];
                // check if the last tag in the stack has the same name then add the line and pop()
                // else we check if the stack contains the opening of this tag, and if so we close all tags till we reach it
                // else we add its opening tag before it
                if(stack.top() == tag_name) {
                    lines_corrected[length_corrected++] = lines[i];
                    stack.pop();
                }
                else if(stack.contains(tag_name)) {
                    while(stack.top()!=tag_name){
                        lines_corrected[length_corrected++] = "</" + stack.top() + ">";
                        stack.pop();
                    }
                    lines_corrected[length_corrected++] = "</" + stack.top() + ">";
                    stack.pop();
                }
                else {
                    lines_corrected[length_corrected++] = "<" + tag_name + ">";
                    lines_corrected[length_corrected++] = lines[i];
                }
            }
        }
        else {
            lines_corrected[length_corrected++] = lines[i];
        }
    }

    // if stack isn't empty after parsing the whole file then that indicates that 
    // there is one or more opening tags without a closing tag
    // thus add their closing tags then return the corrected xml data
    while(!stack.isEmpty()){
        lines_corrected[length_corrected++] = "</" + stack.pop() + ">";
    }

    return lines_corrected.join("\n");
}

// implement the beautify() function, returns string with beautified xml data
function beautify(file_text = null) {
    if(file_text == null || file_text == "") return "";

    // create array to hold the beautified lines
    var lines_beautified = [];
    var length_beautified = 0;

    // split the file contents into lines
    var lines = file_text.replace(/\r\n/g, '\n').split('\n');

    // remove empty lines
    lines = lines.filter(element => element !== '');

    // stack will only hold names of the opening tags
    const stack = new Stack();

    // create var for holding current indentation level
    var current_indentation_level = 0;

    // beautify the xml text
    for(var i = 0; i < lines.length; i++) {

        // remove leading/trailing spaces from the line
        lines[i] = lines[i].trim();

        // count num '<' in the line
        // the "|| []" is to ensure that result is 
        // always an array even if there are no matches
        let result = lines[i].match(/</g) || [];
        let num_matches = result.length;

        // if the line is a tag beautify it accordingly
        // else it is normal text and beautify it accordingly
        if(num_matches != 0) {

            // check if the tag is opening <...>, closing </...>, or both <...> </...>
            // simply check if num '<' in the line is 2 then both, thus it gets the indentation of the block it is in
            // else if second character is '!' then comment, thus it gets the indentation of the block it is in
            // else if second character is '?' then it is start tag, thus it gets the indentation of the block it is in
            // else if second character is not '/' then opening, thus it gets the indentation of the block it is in and we increment the indentation for the next elements
            // else it is closing, thus it gets an indentation less than the block it is in and we decrement the indentation for the next elements
            if(num_matches == 2) {
                lines_beautified[length_beautified++] = '    '.repeat(current_indentation_level) + lines[i];
            }
            else if(lines[i][1] == '!') {
                lines_beautified[length_beautified++] = '    '.repeat(current_indentation_level) + lines[i];
            }
            else if(lines[i][1] == '?') {
                lines_beautified[length_beautified++] = '    '.repeat(current_indentation_level) + lines[i];
            }
            else if(lines[i][1] != '/') {
                lines_beautified[length_beautified++] = '    '.repeat(current_indentation_level) + lines[i];
                current_indentation_level++;
            }     
            else {
                current_indentation_level--;
                lines_beautified[length_beautified++] = '    '.repeat(current_indentation_level) + lines[i];
            }
        }
        else {
            lines_beautified[length_beautified++] = '    '.repeat(current_indentation_level) + lines[i];
        }

    }

    // return the beautified xml data
    return lines_beautified.join("\n");
}


module.exports = {Stack, validate, correct, beautify};


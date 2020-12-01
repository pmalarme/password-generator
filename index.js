const { program } = require('commander');

function processInt(value, dummyPrevious) {
    return parseInt(value);
}

function returnRandomCharFromString(str) {
    var index = Math.floor(Math.random() * str.length);
    return str.charAt(index);
}

function checkSameString(str1, str2, caseUnsensitiveCheck) {
    if (!str1 || !str2) {
        return false;
    } else if (caseUnsensitiveCheck) {
        return str1.toLowerCase() == str2.toLowerCase;
    } else {
        return str1 == str2;
    }
}

program
    .version('1.0.0')
    .option('-c, --same-characters', 'allow consecutive characters to be the same')
    .option('-ca, --same-characters-any-case', 'do not allow same character even if the case is different (e.g. does not allow "cC"')
    .option('-s, --special-characters', 'use of special characters in the password')
    .option('-l, --length <length>', 'set the length of the password (default: 16)', processInt);

var lowerCase = "abcdefghijklmnopqrstuvxyz";
var upperCase = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
var numbers = "0123456789";
var specialCharacters = " !\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~";

program.parse(process.argv);
// Password length
var passwordLength;
if (program.length > 0) {
    passwordLength = program.length;
}
else {
    passwordLength = 16;
}
// Allow consecutive characters to be the same
var allowSameCharacters = false;
if (program.sameCharacters) {
    allowSameCharacters = true;
}
// Do not allow consecutive characters to be the same (case independent)
var doNotAllowSameCharactersAnyCase = false;
if (program.sameCharactersAnyCase) {
    doNotAllowSameCharactersAnyCase = true;
}
// Special characters
var useSpecialCharacters = false;
if (program.specialCharacters) {
    useSpecialCharacters = true;
}

var password = "";

var previousChar;
var previousCategory;
var i;
for (i = 0; i < passwordLength; i++) {
    var index;
    // Select chosen category and check that it is not the same as the previous one
    var chosenCategory;
    if (useSpecialCharacters) {
        chosenCategory = Math.floor(Math.random() * 4);
    } else {
        chosenCategory = Math.floor(Math.random() * 3);
    }
    if (chosenCategory == previousCategory) {
        i--;
        continue;
    } else {
        previousCategory = chosenCategory;
    }
    // Get the new character
    var currentChar;
    switch(chosenCategory) {
        case 0:
            currentChar = returnRandomCharFromString(lowerCase);        
            break;
        case 1:
            currentChar = returnRandomCharFromString(upperCase);
            break;
        case 2:
            currentChar = returnRandomCharFromString(numbers);
            break;
        case 3:
            currentChar = returnRandomCharFromString(specialCharacters);
            break;
    }
    // Check if we allow or not the same character (case sensitive or not)
    if (!allowSameCharacters && checkSameString(currentChar, previousChar, doNotAllowSameCharactersAnyCase)) {
        i--;
    }
    // Check if the character is a space and it is the first character then we need another one
    else if ((i == 0 || i == (passwordLength -1)) && currentChar == ' ') {
        i--;
    } else {
        password += currentChar;
        previousChar = currentChar;
    }       
}

console.log(password);

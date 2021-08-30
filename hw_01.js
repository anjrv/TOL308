"use strict";

// ABSOLUTE VALUE
// --------------
//
// Return the absolute value of the given `number`
// e.g. abs(3) === 3; abs(-4.9) === 4.9
//
// MARKING: 1 point
//
function abs(number) {
    return number < 0 ? number * -1 : number;
}


// MAXIMUM OF TWO
// --------------
//
// Return the maximum of the numbers `a` and `b`
// e.g. maxOfTwo(-2, 9.1) === 9.1; maxOfTwo(10, 10) === 10
//
// MARKING: 1 point
//
function maxOfTwo(a, b) {
    return b > a ? b : a;
}


// MAXIMUM OF THREE
// ----------------
//
// Return the maximum of the numbers `a`, `b` and `c`
//
// MARKING: 1 point
//
function maxOfThree(a, b, c) {
    if(a >= b && a >= c) return a;
    if(b >= a && b >= c) return b;
    return c;
}


// MEDIAN OF THREE
// ---------------
//
// Return the median (ordered middle value) of the given numbers
// e.g. medOfThree(2,1,9) === 2
//
// MARKING: 2 points
//
function medOfThree(a, b, c) {
    if ((b <= a && a <= c) || (c <= a && a <= b)) return a;
    if ((a <= b && b <= c) || (c <= b && b <= a)) return b;
    return c;
}


// TEST FOR PRIMALITY
// ------------------
//
// Return `true` if `integer` is prime, otherwise `false`
//
// "A prime number is a natural number greater than 1 that has 
// no positive divisors other than 1 and itself."
// --- http://en.wikipedia.org/wiki/Prime_number
// 
// You may assume that `integer` is, indeed, an integer.
// You may not assume anything else about it!
// 
// MARKING: 3 points for correctness
// EXTRA:   try for efficiency (hint: sqrt without sqrt)
//
function isPrime(integer) {
}


// STRING REVERSAL
// ---------------
//
// Return a reversed version of the given string, `str`
// e.g. reverseString("doogyrev") === "verygood" 
//
// You do not have to worry about full Unicode support.
// The test strings will be within the standard ASCII range.
//
// BTW: The constraints of this exercise may force you into an inefficient 
// (but simple) solution. Don't worry about the inefficiency.
//
// MARKING: 2 point
//
function reverseString(str) {
    let res = '';

    for (let i = str.length - 1; i >= 0; i--) {
        console.log(str[i]);
    }

    return res;
}


// PUNCTUATION
// -----------
//
// Return `true` if the given `char` is punctuation (by our rather
// limited definition below), otherwise return `false`.
//
// The characters on the next line define our set of "punctuation" (not including the space):
// ,!.:;/()
//
// MARKING: 1 point
//
function isPunct(chr) {
    const punctuation = ',!.:;/()';

    for (let i = 0; i < punctuation.length; i++) {
        if (chr === punctuation[i]) return true;
    }

    return false;
}


// EXTRACT WORDS
// -------------
//
// Return an ordered array of "words", extracted from the given string.
//
// We define a "word" as being a contiguous sequence of characters
// which are neither "punctuation" (as defined above) nor spaces.
//
// e.g.
//
// extractWords("Words, words. They're all we have to go on.")
// returns ["Words","words","They're","all","we","have","to","go","on"]
//
// extractWords("   All work and noplay,  makws Jacka dul; boy")
// returns ["All","work","and","noplay","makws","Jacka","dul","boy"]
//
// NB: If you are writing your own tests, remember that sensible
//     equality-testing with arrays is non-trivial in JavaScript.
//     (So you might want to write a helper function to do it.)
//
// MARKING: 3 points
//
function extractWords(str) {
    const res = [];
    let seq = 0;
    let currWord = '';
    let isWord = false;

    for (let i = 0; i < str.length; i++) {
        if (str[i] !== ' ' && !isPunct(str[i])) {
            isWord = true;
            currWord += str[i];
        } else if (isWord) {
            isWord = false;
            res[seq] = currWord;
            currWord = '';
            seq++;
        }
    }

    if (isWord) res[seq] = currWord;

    return res;
}


// DECODE MNEMONIC
// ---------------
//
// Return a string which describes the length of each of the words
// in the given string. (Using our previous definition of "word").
//
// e.g.
//
// decodeMnemonic(
//    "Supercalifragilisticexpialidocious! " +
//    "Pneumonoultramicroscopicsilicovolcanoconiosis") === "3445"
//
// decodeMnemonic(
//    "Now I need a drink, alcoholic of course, " +
//    "after the heavy lectures!") === "314159265358" 
//
// decodeMnemonic(
//    "Now I, even I, would celebrate in rhymes inept, " +
//    "the great immortal Syracusan (rivaled nevermore!) " +
//    "who in his wondrous lore, passed on before, " +
//    "gave men his guidance how to circles mensurate.") ===
//    "3141592653589793238462643383279"
// 
// REFERENCE: http://www.exploratorium.edu/pi/history_of_pi/
//
// Unfortunately, reasons of space prevent me from including this
// one directly: http://www.cadaeic.net/naraven.htm
//
// HINT: Sometimes implicit type-conversion is your friend!
//
// MARKING: 2 points
//
function decodeMnemonic(str) {
    const words = extractWords(str);
    let res = '';

    for (let i = 0; i < words.length; i++) {
        res += words[i].length;
    }

    return res;
}

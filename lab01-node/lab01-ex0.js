/* 
 * [2024/2025]
 * Web Applications
 * Lab 1 - Exercise 0
 */

'use strict';

const words = ["spring", "summer", "a", "ab", "abc", "autumn", "winter"];

function resizeString(str) {
    let newStr;
    if (str.length < 2)
        newStr = "";
    else
        newStr = str.substring(0, 2) + str.substring(str.length - 2, str.length);
    return newStr;
}

for (let i = 0; i < words.length; i++) {
    const str = resizeString(words[i]);
    console.log(str);  // Printing one string per line
}

/*  // Functional Alternative
const newWords = words.map((str) => resizeString(str));
console.log(newWords);  // printing the whole array in one line
*/

/** Other Possible Approaches **/

/*  // ALTERNATIVE 1
for(const [i, w] of words.entries()) {
    if(w.length < 2)
        words[i] = "";
    else 
        words[i] =  w.substring(0,2) +  w.substring(w.length -2,  w.length);
}
console.log(words);  // printing the whole array in one line
*/

/*  // ALTERNATIVE 2
words.forEach((item,index) => {
    if(item.length < 2)
        words[index] = "";
    else 
        words[index] = item.substring(0,2) + item.substring(item.length -2, item.length);
});
console.log(words);  // printing the whole array in one line
*/


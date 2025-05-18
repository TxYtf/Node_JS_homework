const inputString = process.argv[2];

if (!inputString) {
    console.error("X Помилка: передайте вкладений масив як аргумент після index.js \"[[1,2],[3,4],[5,6]]\" ");
    process.exit(1);
}

let brackets = 0;
for (let i=0; i < inputString.length; i++) {
    if (inputString[i] === '[') brackets++
    else if (inputString[i] === ']') brackets--;

    if (brackets < 0) break;
}
if (brackets !== 0) console.log("Wrong array format");
else {
    console.log("- Введений масив: ", inputString.split('"').join(""));
}

let elementsArr = inputString.split(',');
let elArr2 = [];
for (let i= 0; i < elementsArr.length; i++) {
    let el1 = elementsArr[i]
        .split('[')
        .map((el) => ((el === '') ? el = '[' : el));
    elArr2.push(...el1);
}

let elArr4 = [];
for (let i = 0; i < elArr2.length; i++) {
    let el3 = elArr2[i]
        .split(']')
        .map((el) => ((el === '') ? el = ']' : el));
    elArr4.push(...el3);
}
console.log(elArr4);

console.log(recurseArrSum (elArr4,elArr4.length-1));


function recurseArrSum (arr1, pos) {
    //console.log(pos, arr1[pos]);
    if (pos === 0) return 0;
    return recurseArrSum(arr1, pos - 1) + ((arr1[pos] === '[' || arr1[pos] === ']') ? 0 : Number(arr1[pos]));
}

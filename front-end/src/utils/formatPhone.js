export default function formatPhone(str) {
    var newStr = str.slice(1);
    newStr =
        "+84 " +
        newStr.slice(0, 2) +
        " " +
        newStr.slice(2, 5) +
        " " +
        newStr.slice(5, 8) +
        " " +
        newStr.slice(8);
    return newStr;
}

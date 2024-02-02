export default function formatPhone(str) {
    str =
        "+" +
        str.slice(0, 2) +
        " " +
        str.slice(2, 5) +
        " " +
        str.slice(5, 8) +
        " " +
        str.slice(8);
    return str;
}

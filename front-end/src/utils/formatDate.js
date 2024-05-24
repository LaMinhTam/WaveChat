import moment from "moment-timezone";
export default function formatDate(timestamp) {
    if (!timestamp) return;
    else {
        const date = moment(timestamp, "DD-MM-YYYY HH:mm:ss").tz(
            "Asia/Ho_Chi_Minh"
        );
        let hours = date.hours();
        let minutes = date.minutes();

        // Pad the minutes and hours with 0s on the left if they are less than 10
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        const timeString = `${hours}:${minutes}`;
        return timeString;
    }
}

export function formatBirthDay(date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
}

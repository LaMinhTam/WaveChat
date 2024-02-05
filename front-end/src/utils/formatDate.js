import { fromUnixTime } from "date-fns";
import moment from "moment-timezone";
export default function formatDate(timestamp) {
    if (!timestamp) return;
    else {
        if (typeof timestamp === "string" && timestamp.includes("/")) {
            let dateParts = timestamp.split("/").reverse();
            let formattedDate = new Date(dateParts.join("/"));
            return formattedDate;
        } else if (typeof timestamp === "number") {
            // Convert the timestamp to seconds
            const date = fromUnixTime(timestamp / 1000);
            // Convert the Date object to Vietnam time
            const vietnamTime = moment(date).tz("Asia/Ho_Chi_Minh");
            // Format the date and time
            const formattedDate = vietnamTime.format("YYYY-MM-DD HH:mm:ss");
            return formattedDate;
        }
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

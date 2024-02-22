import moment from "moment";

export default function formatTime(updated_at) {
    const now = moment();
    const updatedAt = moment(updated_at, "DD-MM-YYYY HH:mm:ss");
    const diffInMinutes = now.diff(updatedAt, "minutes");
    const diffInHours = now.diff(updatedAt, "hours");
    const diffInDays = now.diff(updatedAt, "days");
    const diffInYears = now.diff(updatedAt, "years");

    if (diffInMinutes < 60) {
        return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""}`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;
    } else if (diffInDays < 6) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
    } else if (diffInYears < 1) {
        return updatedAt.format("DD/MM");
    } else {
        return updatedAt.format("DD/MM/YY");
    }
}

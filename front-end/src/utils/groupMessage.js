import moment from "moment";
export default function groupMessages(messages) {
    const groupedMessages = [];
    let currentGroup = null;

    messages.forEach((message) => {
        let messageTime = moment(message.created_at, "DD-MM-YYYY HH:mm:ss");
        if (currentGroup && messageTime.diff(currentGroup.time, "hours") < 1) {
            currentGroup.data.push(message);
        } else {
            const formattedTime = messageTime.isSame(moment(), "day")
                ? `Hôm nay ${messageTime.format("HH:mm")}`
                : messageTime.format("HH:mm DD/MM/YYYY");
            currentGroup = {
                time: messageTime,
                formattedTime: formattedTime,
                data: [message],
            };
            groupedMessages.push(currentGroup);
        }
    });

    return groupedMessages;
}

export function groupMessagesByDate(messages) {
    const groupedMessages = [];
    let currentGroup = null;

    messages.forEach((message) => {
        let messageTime = moment(message.created_at);
        if (currentGroup && messageTime.isSame(currentGroup.time, "day")) {
            currentGroup.data.push(message);
        } else {
            const formattedTime = messageTime.isSame(moment(), "day")
                ? "Hôm nay"
                : messageTime.format("DD/MM/YYYY");
            currentGroup = {
                time: messageTime,
                formattedTime: formattedTime,
                data: [message],
            };
            groupedMessages.push(currentGroup);
        }
    });

    return groupedMessages;
}

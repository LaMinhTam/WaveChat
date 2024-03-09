import moment from "moment";
export default function groupMessages(messages) {
    const groupedMessages = [];
    let currentGroup = null;

    messages.forEach((message) => {
        let messageTime = moment(message.updated_at);
        if (currentGroup && messageTime.diff(currentGroup.time, "hours") < 1) {
            // If the message is less than 1 hour apart from the current group, add it to the group
            currentGroup.data.push(message);
        } else {
            // If the message is more than 1 hour apart from the current group, or if there is no current group,
            // create a new group
            const formattedTime = messageTime.isSame(moment(), "day")
                ? `${messageTime.format("HH:mm")} Hôm nay`
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

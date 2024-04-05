export default function handleFormatMessage(msg) {
    let message = "";
    if (msg?.type === 14) {
        message = "Tin nhắn đã thu hồi";
    } else if (msg?.type === 1) {
        message = msg.message;
    } else {
        message = "";
    }
    return message;
}

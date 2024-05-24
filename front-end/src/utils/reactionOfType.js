export default function typeToReaction(type) {
    const data = {
        like: "👍",
        love: "❤️",
        haha: "😆",
        please: "🙏",
        sad: "😢",
        dislike: "👎",
        angry: "😡",
    };

    switch (type) {
        case 1:
            return data.like;
        case 2:
            return data.love;
        case 3:
            return data.haha;
        case 4:
            return data.please;
        case 5:
            return data.sad;
        case 6:
            return data.dislike;
        case 7:
            return data.angry;

        default:
            return null;
    }
}

export function reactionToType(reaction) {
    const data = {
        like: "👍",
        love: "❤️",
        haha: "😆",
        please: "🙏",
        sad: "😢",
        dislike: "👎",
        angry: "😡",
    };

    switch (reaction) {
        case data.like:
            return 1;
        case data.love:
            return 2;
        case data.haha:
            return 3;
        case data.please:
            return 4;
        case data.sad:
            return 5;
        case data.dislike:
            return 6;
        case data.angry:
            return 7;

        default:
            return null;
    }
}

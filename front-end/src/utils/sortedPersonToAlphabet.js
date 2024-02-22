export default function sortedPersonToAlphabet(personList) {
    const sortedPersonList = [...personList].sort((a, b) => {
        if (
            typeof a.full_name === "string" &&
            typeof b.full_name === "string"
        ) {
            return a.full_name.localeCompare(b.full_name);
        }
        return 0;
    });

    const groupedPersonList = sortedPersonList.reduce((acc, person) => {
        if (typeof person.full_name === "string") {
            const firstLetter = person.full_name[0].toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(person);
        }
        return acc;
    }, {});

    return Object.entries(groupedPersonList).map(([key, data]) => ({
        key,
        data,
    }));
}

export default function getFirstLetters(name, options = {}) {
    const { limit = 2, upperCase = true } = options;

    if (!name) return "";
    const splitNames = name.split(" ");
    const letters = [];

    splitNames.forEach((word, ind) => {
        const currPos = ind + 1;
        if (currPos > limit) return null;

        const newLetter = upperCase ? word[0].toUpperCase() : word[0];
        return letters.push(newLetter);
    });

    return letters.join("");
}

// exaples luis febro bruno === LF

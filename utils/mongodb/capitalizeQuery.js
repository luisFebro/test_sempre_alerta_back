const firstSpaceInd = { $indexOfBytes: ["$name", " "] };
const firstNameQuery = { $substr: ["$name", 0, "$$firstSpaceInd"] };

// returns capitalized first name of the user only
function capitalizeQuery(nameQuery = "$name") {
    const firstNameQ = { $toUpper: { $substr: [nameQuery, 0, 1] } };

    return {
        $let: {
            vars: { firstSpaceInd },
            in: {
                $concat: [
                    firstNameQ,
                    {
                        $substr: [
                            firstNameQuery,
                            1,
                            { $strLenBytes: firstNameQuery },
                        ],
                    },
                ],
            },
        },
    };
}

module.exports = capitalizeQuery;

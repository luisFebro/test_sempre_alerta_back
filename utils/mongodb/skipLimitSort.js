const unwind = require("./unwind");
// for subarrays pagination
// need $list and $listTotal in prior aggregation pipeline
// do not forget to set the data to be read like list && list[0]. useApiList reads object instead of array
function skipLimitSort({ skip, limit, list, sort, addListTotal, content }) {
    limit = Number(limit);
    skip = Number(skip);
    const { finalSkip, finalLimit } = getFinalChunks(skip, limit);

    if (list)
        return {
            $group: {
                _id: null,
                list: {
                    $push: list, // e.g "$my.list"
                },
                listTotal: { $sum: 1 },
            },
        };

    if (sort)
        return {
            $sort: sort,
        };

    if (addListTotal) {
        return {
            $addFields: {
                listTotal: {
                    $size: "$list",
                },
            },
        };
    }

    return {
        $project: {
            _id: 0,
            list: { $slice: ["$list", finalSkip, finalLimit] },
            listTotal: "$listTotal",
            chunksTotal: { $ceil: { $divide: ["$listTotal", Number(limit)] } },
            content,
        },
    };
}

/*
required to be used like:
UPDATE: it doesn't require a list declared in mainAggr anymore as long as we have all object elements to inserted in the list right in this function... BEFORE: and mainAggr must returns a list which is an array with objects to be enlisted.
const userData = await User("cliente")
    .aggregate([...mainAggr, ...handleList({ skip, limit })]);
*/
function handleList(options = {}) {
    const {
        needList = false,
        limit = 5,
        skip = 0,
        sort = { createdAt: -1 },
        content, // for additional related data. it should be a list like `data1:abc;data2:dce;`
    } = options;

    const allData = [
        {
            $sort: sort,
        },
        {
            $group: {
                _id: null,
                list: { $push: "$$ROOT" },
            },
        },
        skipLimitSort({ addListTotal: true }),
        skipLimitSort({
            limit,
            skip,
            content,
        }),
    ];

    if (needList) {
        allData.unshift(unwind("$list"));
        allData.unshift(replaceWith("$list"));
    }

    return allData;
}

// for lists use skip, limit with mongodb
function checkEmptyList(data = []) {
    const listData = (data.length && data[0].list) || (data && data.list);

    const isEmptyList = JSON.stringify(listData) === "[{}]" || !listData;
    if (isEmptyList) return { list: [], listTotal: 0, chunksTotal: 0 };
    return false;
}

// avoid errors if there are no items
function replaceWith(elem) {
    // e.g $list
    // handle when no price is displayed here;.... MongoError: 'replacement document' must evaluate to an object, but resulting value was: []. Type of resulting value: 'array'. Input document: {list: []}
    return {
        $replaceWith: {
            $ifNull: [{ $cond: [{ $isArray: elem }, {}, elem] }, {}],
        },
    };
}

module.exports = {
    handleList,
    skipLimitSort,
    checkEmptyList,
    replaceWith,
};

// HELPERS
function getFinalChunks(skip, limit) {
    const handleLimit = () => {
        if (limit === 1) return skip + 1;
        if (skip) return limit * (skip + 1);
        return limit;
    };

    const finalSkip = limit * skip;
    const finalLimit = handleLimit();

    return { finalSkip, finalLimit };
}
// END HELPERS

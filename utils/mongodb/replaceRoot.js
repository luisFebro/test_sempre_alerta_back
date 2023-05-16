const unwind = require("./unwind");

const replaceRoot = (path) => {
    // path e.g $orders n1
    return {
        $replaceRoot: { newRoot: { $ifNull: [path, {}] } },
    };
};

module.exports = {
    unwind,
    replaceRoot,
};

/* COMMENTS
n1: like unwind, this will take nested objects-like and unwind them to the root
this
[
    {"orders":[{"planExpiringDate":"2021-10-26T00:31:06.632Z","transactionStatus":"pago"}]},
    {"orders":[{"planExpiringDate":"2021-10-26T00:31:06.632Z","transactionStatus":"pago"}]},
]

after
unwind("$orders"),
replaceRoot("$orders"),
[
   {"planExpiringDate":"2021-10-26T00:31:06.632Z","transactionStatus":"pago"},
    {"planExpiringDate":"2021-10-26T00:31:06.632Z","transactionStatus":"pago"},
]
 */

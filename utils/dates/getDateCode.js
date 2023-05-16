// useful to know which date is largest than another without year as parameter like brithdays
// for now, only works for string br dates: e.g 23 de Agosto de 1994
//  format: month code + day code (always the last 2 digits. The first characters can be either one or two characters for month. for instance, january 5th will be 105, and dezember 5th will be 1205)

function getMonthesDetails() {
    return {
        janeiro: {
            maxDay: 31,
            codeNum: 1,
        },
        fevereiro: {
            maxDay: 28,
            codeNum: 2,
        },
        março: {
            maxDay: 31,
            codeNum: 3,
        },
        abril: {
            maxDay: 30,
            codeNum: 4,
        },
        maio: {
            maxDay: 31,
            codeNum: 5,
        },
        junho: {
            maxDay: 30,
            codeNum: 6,
        },
        julho: {
            maxDay: 31,
            codeNum: 7,
        },
        agosto: {
            maxDay: 31,
            codeNum: 8,
        },
        setembro: {
            maxDay: 30,
            codeNum: 9,
        },
        outubro: {
            maxDay: 31,
            codeNum: 10,
        },
        novembro: {
            maxDay: 30,
            codeNum: 11,
        },
        dezembro: {
            maxDay: 31,
            codeNum: 12,
        },
    };
}

const monthesDetails = getMonthesDetails();

function getDateCode(strDate) {
    if (!strDate)
        return {
            code: 0,
            monthCode: 0,
            maxDayMonth: 0,
        };

    const indFirstSpacing = strDate.indexOf(" ");
    let day = strDate.slice(0, indFirstSpacing);
    if (day === "1º") day = "01";
    if (day.length === 1) day = `0${day}`;

    const indFirstMonthSpacing = strDate.lastIndexOf(" ", 8); // n1
    const slicedMonthDate = strDate.slice(indFirstMonthSpacing).trim();
    const indLastMonthSpacing = slicedMonthDate.indexOf(" ");
    const month = slicedMonthDate.slice(0, indLastMonthSpacing).toLowerCase();
    const { codeNum: monthCode, maxDay: maxDayMonth } = monthesDetails[month];

    return {
        code: Number(monthCode + day),
        monthCode,
        maxDayMonth,
    };
}

module.exports = getDateCode;
// console.log(getDateCode("5 de Agosto de 2017"));
// { code: 805, monthCode: 8, maxDayMonth: 31 }

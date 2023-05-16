const getMonth = require("date-fns/getMonth");
const addDays = require("date-fns/addDays");
const addMonths = require("date-fns/addMonths");
const addHours = require("date-fns/addHours");
const startOfMonth = require("date-fns/startOfMonth");
const set = require("date-fns/set");

const lastMonth = addDays(startOfMonth(new Date()), -1);

const getCurrMonth = (date = new Date()) => {
    const monthes = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
    ];

    const indMonth = getMonth(date);
    return monthes[indMonth];
};

// n1 - especially useful for expiration date
const setUTCDateTime = (options = {}) => {
    // 4 hour is the most late offset so that we can use UTC dates from midnight of the date. If in SP when the UTC offset is 3, it will be triggered 1am and so on... 4 hour offset is only valid in the backend because this date will be handled in a foreign server and UTC is 0, no diff.
    // In frontend, this should be 0 hour as default and it will be converted auto to UTC hour timezone+
    // also set a date to have early hours as possible to be detected in that day. If user buy at 23, the algo will only track it the next day
    // the localhost time will still add 4 hours getting 8 hours, but on production this will be added normally as 4 UTC hours
    const { date = new Date(), hours = 4, minutes = 0, seconds = 0 } = options;
    return set(new Date(date), { hours, minutes, seconds });
};

module.exports = {
    getCurrMonth,
    addDays,
    addMonths,
    addHours,
    lastMonth,
    setUTCDateTime,
};

/* COMMENTS
n1:
// some dates should have hour modified so that some cron-jobs can be triggered in the exact date, for instance.
// if a date is recorded with a later hour and a cron-job is triggered by 6am earlier, this means the date will only be triggered next day.
// if desired date is the recorded date, we want this instead a plus day.
// https://www.ursahealth.com/new-insights/dates-and-timezones-in-javascript
*/

// REFERENCE FROM FRONTEND:
// import ptBR from "date-fns/locale/pt-BR";
// import formatDistance from "date-fns/formatDistance";
// import formatRelative from "date-fns/formatRelative";
// import format from "date-fns/format";
// import subDays from "date-fns/subDays";
// import addDays from "date-fns/addDays";
// import getHours from "date-fns/getHours";
// import getMinutes from "date-fns/getMinutes";
// import isToday from "date-fns/isToday";
// import startOfWeek from "date-fns/startOfWeek";
// import endOfWeek from "date-fns/endOfWeek";
// import isAfter from "date-fns/isAfter";
// import { getPureParsedDate } from "./helpers/dateFnsHelpers";
// import getDayMonthBr from "./getDayMonthBr"; // 20 de Junho de 2020 is better than 20º de junho, 2020...

// const localeObj = {
//     default: ptBR,
//     ptBR,
// };

// const dateFnsUtils = DateFnsUtils;
// const ptBRLocale = ptBR;

// const treatZero = (number) => {
//     if (Number(number) <= 9) {
//         return `0${number}`;
//     }
//     return number;
// };

// // tools
// const pick = (locale) => (locale ? localeObj[locale] : localeObj.default);
// const now = new Date();

// const formatDMY = (date, short = false, needYear = true) =>
//     getDayMonthBr(date, { needYear, short });
// const fromNow = (pastDate, locale) =>
//     formatDistance(new Date(pastDate), now, {
//         addSuffix: true,
//         locale: pick(locale),
//         includeSeconds: true,
//     });
// // calendar needs a customformatlike ``{ sameElse: 'll'}`` in moment.
// const calendar = (date, locale) =>
//     formatRelative(new Date(date), now, { locale: pick(locale) });

// const getLocalHour = (date) =>
//     `${getHours(new Date(date))}:${treatZero(getMinutes(new Date(date)))}`;

// // targetDate is inclusive. it will only be expired after the targetDate has passed.
// const isScheduledDate = (targetDate, options = {}) => {
//     const { isDashed = false } = options; // dashed Date = 2020-12-30 format
//     if (!targetDate) return;

//     const today = getPureParsedDate(new Date(), { minHour: true });
//     const scheduled = getPureParsedDate(targetDate, { isDashed });
//     if (today < scheduled) {
//         return true;
//     }

//     return false;
// };

// const checkToday = (date) => isToday(new Date(date));
// const endWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
// const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

// const formatSlashDMY = (newDate = new Date()) => format(newDate, "dd/MM/yyyy");

// export {
//     dateFnsUtils,
//     ptBRLocale,
//     formatDMY,
//     formatSlashDMY,
//     fromNow,
//     calendar,
//     addDays,
//     subDays,
//     getLocalHour,
//     checkToday,
//     isScheduledDate,
//     endWeek,
//     startWeek,
//     isAfter, // Is the first date after the second one?
// };

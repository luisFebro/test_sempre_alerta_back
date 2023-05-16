// reference: https://www.quora.com/How-to-calculate-the-growth-rate-of-a-start-up

// this can be used in the history of revenues in the KPIs sessions in future updates
function getYearlyGrowthRateGoal(startYearGrossRevenue = 1000, options = {}) {
    const { growthPerc = 7, yearCount = 1 } = options;

    const WEEKS_IN_YEAR = 52;
    const multiplier = 1 + growthPerc / 100;

    return {
        val: Number(
            (
                startYearGrossRevenue *
                multiplier ** (yearCount * WEEKS_IN_YEAR)
            ).toFixed(2)
        ),
        perc: WEEKS_IN_YEAR * yearCount,
    };
}

function getCurrWeekGrowthRateGoal(lastWeekGrossRevenue = 1000, options = {}) {
    // n1
    const { growthPerc = 7 } = options;

    const multiplier = 1 + growthPerc / 100;

    const currWeekRevenueGoal = lastWeekGrossRevenue * multiplier;
    return Number(currWeekRevenueGoal.toFixed(2));
}

/* COMMENTS
n1:
Desired growth rate = growthPerc%
Last week’s revenue times (1+growthPerc) = this week’s revenue goal.
Ex:
• 5% weekly growth rate
• $1,000 revenue last week
$1,000 x (1.05%) = $1,050 sales needed this week

*/

module.exports = {
    getCurrWeekGrowthRateGoal,
    getYearlyGrowthRateGoal,
};

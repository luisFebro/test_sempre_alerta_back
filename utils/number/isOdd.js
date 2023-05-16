function isOdd(num) {
    return Boolean(Math.abs(num % 2 === 1));
}

module.exports = isOdd;

// e.g 9 true, 7 true, 5 true...
// zero is not odd, but even - returning false

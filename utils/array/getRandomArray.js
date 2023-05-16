/*
 * randomize a specific array without any field reference
 * @param  {Array} array [target array,especially composed byobjs]
 * @return {Array | Object | String}       [selected String or Obj, or ramdomized array passed in the parameter]
 */

function getRandomArray(array, options = {}) {
    const { selectOne = false } = options;

    const sortedArray = array.sort((a, b) => 0.5 - Math.random());

    const ind = array.length;
    const randomNum = Math.floor(Math.random() * ind); // 0 to 9 index. select one of the first 10 results from the random array.

    // return only the first random result
    if (selectOne) return sortedArray[randomNum];

    return sortedArray;
}

module.exports = getRandomArray;

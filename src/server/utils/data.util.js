'use strict';

module.exports = {
    
    parseObjectAsArray (obj) {
        var array = [];
        Object.keys(obj).forEach((key) => {
            array.push(obj[key]);
        });
        return array;
    },
    
    /**
     * generateTimeline
     * @param size
     * @param skip
     * @param suffix
     * @returns {Array.<T>}
     */
    generateTimeline (size, skip, suffix) {
        return new Array(size)
            .fill()
            .map((value, index) => index)
            .filter((value, index) => index % skip === 0)
            .map((value) => (value ? '-' : '') + value + suffix)
            .reverse();
    }
    
}
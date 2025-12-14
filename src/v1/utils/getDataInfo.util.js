const lodash = require('lodash');

const getDataInfo = (fields = [] , object = {}) => {
    return lodash.pick(object, fields);
}

module.exports = {
    getDataInfo
}
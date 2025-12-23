const lodash = require('lodash');

const getDataInfo = (fields = [] , object = {}) => {
    if (Array.isArray(object)) {
    return object.map(item => lodash.pick(item, fields));
    }    
    return lodash.pick(object, fields);
}

module.exports = {
    getDataInfo
}
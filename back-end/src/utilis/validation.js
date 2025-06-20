const validator = require('validator');

function isValidData(value) {
    if (!validator.isEmail(value.email)) {
        throw new Error("InValid Email");
    }
}

function isValidProfileData(userData) {
    const ALLOWABLE_FIELDS = ['firstName', 'lastName', 'skills', 'photoUrl', 'age', 'about', 'gender'];

    const isAllowed = Object.keys(userData).every(key => ALLOWABLE_FIELDS.includes(key));
    return isAllowed;
}

module.exports = { isValidData, isValidProfileData };
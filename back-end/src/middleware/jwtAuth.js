const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../constant/static');
const { UserModel } = require('../models/user');

const jwtAuth = async (req, res, next) => {
    try {
        const cookie = req.cookies;
        const { token } = cookie;

        if (!token) {
            throw new Error("Invalid Token");
        }

        const decodeMessage = await jwt.verify(token, SECRET_KEY);
        const { _id } = decodeMessage;
        const user = await UserModel.findOne({ _id });

        if (!user) {
            throw new Error("User Not Found");
        }

        req.user = user;
        next()
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

module.exports = { jwtAuth };
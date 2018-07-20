const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const appConfig = require('../../config/appconfig');
const userController = require('../controller/userController');
const authMiddleware = require('../middlewares/auth');


let setRouter = (app) =>{

    let baseURl = `${appConfig.apiVersion}/users`;

    app.post(`${baseURl}/signup`,userController.signup);

    app.post(`${baseURl}/login`,userController.login);

}


module.exports = {
    setRouter:setRouter
}
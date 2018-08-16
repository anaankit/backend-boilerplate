const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const appConfig = require('../../config/appconfig');
const userController = require('../controller/userController');
const authMiddleware = require('../middlewares/auth');


let setRouter = (app) =>{

    let baseURl = `${appConfig.apiVersion}/users`;

    app.post(`${baseURl}/signup`,userController.signup);
        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/singup api for new user singup.
     *
     * @apiParam {string} firstName first Name of the user. (body params) (required)
     * @apiParam {string} LastName  last Name of the user. (body params) (required)
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {number} mobileNumber mobileNumber  of the user. (body params) (required)
     * @apiParam {Number} countryCode countryCode of the user. (body params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "User Account successfully create",
    "status": 200,
    "data": {
        "userId": "QTWguvRkA",
        "userType": "admin",
        "firstName": "test",
        "lastName": "Admin",
        "countryCode": 91,
        "mobileNumber": 123,
        "createdOn": "2018-08-03T14:37:13.000Z",
        "PasswordResetToken": "",
        "PasswordResetExpiration": ""
    }
}
    */


    app.post(`${baseURl}/login`,userController.login);

        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post}/api/v1/users/login api for user login.
     * 
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
 {
    "error": false,
    "message": "Login successfull",
    "status": 200,
    "data": {
        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZGQiOiJWSDlrMUpUWnIiLCJpYXQiOjE1MzMzMDcyNTQzOTAsImV4cCI6MTUzMzM5MzY1NCwic3ViIjoiYXV0aFRva2VuIiwiaXNzIjoiZWRDaGF0IiwiZGF0YSI6eyJ1c2VySWQiOiJsTDgxbUtZcWciLCJ1c2VyVHlwZSI6Im5vcm1hbCIsImZpcnN0TmFtZSI6IkFua2l0IiwibGFzdE5hbWUiOiJBbmFuZCIsImVtYWlsIjoiYW5hYW5raXQ5OTJAZ21haWwuY29tIiwiY291bnRyeUNvZGUiOjkxLCJtb2JpbGVOdW1iZXIiOjg4ODQzODMxMzEsIlBhc3N3b3JkUmVzZXRUb2tlbiI6InBkLXZSbnNqeSIsIlBhc3N3b3JkUmVzZXRFeHBpcmF0aW9uIjoiMjAxOC0wOC0wM1QxODoyNToyNC44NDFaIn19.ScC_Lw4ktqdCLs7rcnQn2LYwe95YJDO2uViL1lYyusA",
        "userDetails": {
            "userId": "lL81mKYqg",
            "userType": "normal",
            "firstName": "Ankit",
            "lastName": "Anand",
            "email": "anaankit992@gmail.com",
            "countryCode": 91,
            "mobileNumber": 8884383131,
            "PasswordResetToken": "pd-vRnsjy",
            "PasswordResetExpiration": "2018-08-03T18:25:24.841Z"
        }
    }
}
    */



    app.post(`${baseURl}/getUser`,userController.getUserDetails);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post}/api/v1/users/getUser api to get a user details using user ID.
     * @apiParam {string} user Id. (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
    "error": false,
    "message": "user found",
    "status": 200,
    "data": [
        {
            "userId": "3WRsctFZn",
            "userType": "normal",
            "firstName": "ankit",
            "lastName": "anand",
            "email": "ankit@gmail.com",
            "countryCode": 91,
            "mobileNumber": 123,
            "createdOn": "2018-07-29T08:01:01.000Z"
        }
    }
    */


    app.post(`${baseURl}/update`,userController.updateUser);
    
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post}/api/v1/users/update api to update user details using user ID.
     * @apiParam {string} user Id. (body params) (required)
     * @apiParam {any} all required fields for updating. (URL params) 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
    "error": false,
    "message": "all lists deleted",
    "status": 200,
    "data": {
        "ok": 1,
        "n": 2
    }
}
    */


    app.post(`${baseURl}/updateList`,userController.updateListArr)

    app.post(`${baseURl}/email/getUserDetails`,userController.getUserUsingEmail);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post}/api/v1/users/email/getUserDetails api to get a user details using Email.
     * @apiParam {string} Email. (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
    "error": false,
    "message": "user found",
    "status": 200,
    "data": [
        {
            "userId": "3WRsctFZn",
            "userType": "normal",
            "firstName": "ankit",
            "lastName": "anand",
            "email": "ankit@gmail.com",
            "countryCode": 91,
            "mobileNumber": 123,
            "createdOn": "2018-07-29T08:01:01.000Z"
        }
    }
    */


    app.post(`${baseURl}/add/frndRequest`,userController.addFrndReq);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post}/api/v1/users/add/frndRequest api to send a friend request to a user using user Id.
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiParam {string} frmUserId userId of the receipent of the friend request (body params) (required)
     * @apiParam {string} userId userId of the sender of the friend request (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
    "error": false,
    "message": "list updated successfully",
    "status": 200,
    "data": {
        "userId": "wgr9hX1_Q",
        "firstName": "c",
        "lastName": "c",
        "email": "w@w.com",
        "mobileNumber": 12,
        "countryCode": 91,
        "createdOn": "2018-08-12T14:11:11.000Z",
        "currentIndex": 0,
        "listArr": [],
        "friendReq": [
            {
                "userId": "wgr9hX1_Q",
                "fromUserId": "cBJsTQui9",
                "fromName": "c c",
                "fromEmail": "i@i.com"
            },
            {
                "userId": "wgr9hX1_Q",
                "fromUserId": "cBJsTQui9",
                "fromName": "c c",
                "fromEmail": "i@i.com"
            }
        ],
        "friendList": [
            {
                "userId": "wgr9hX1_Q",
                "fromUserId": "fSa7gmc_o",
                "fromName": "Ankit Anand",
                "fromEmail": "b@b.com"
            },
            {
                "userId": "wgr9hX1_Q",
                "fromUserId": "fSa7gmc_o",
                "fromName": "c c",
                "fromEmail": "m@m.com"
            }
        ],
    }
}
    */


    app.post(`${baseURl}/move`,userController.moveUser);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post}/api/v1/users/move api to to move user from from friend request list to friend list.
     * @apiParam {query} authToken to be provided as query parameter (required) 
     * @apiParam {string} frmUserId user Id of the user to be moved. (body params) (required)
     * @apiParam {string} userId user Id of the user accepting the friend request. (body params) (required) 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
    "error": false,
    "message": "User moved successfully",
    "status": 200,
    "data": {
        "userId": "wgr9hX1_Q",
        "firstName": "c",
        "lastName": "c",
        "email": "w@w.com",
        "mobileNumber": 12,
        "countryCode": 91,
        "createdOn": "2018-08-12T14:11:11.000Z",
        "currentIndex": 0,
        "listArr": [],
        "friendReq": [
        ],
        "friendList": [
            {
                "userId": "wgr9hX1_Q",
                "fromUserId": "fSa7gmc_o",
                "fromName": "Ankit Anand",
                "fromEmail": "b@b.com"
            },
            {
                "userId": "wgr9hX1_Q",
                "fromUserId": "fSa7gmc_o",
                "fromName": "c c",
                "fromEmail": "m@m.com"
            }
        ],
    }
}    */


    app.get(`${baseURl}/getAll`,authMiddleware.isAuthorized,userController.getAllUsers)
        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get}/api/v1/users/getAll api to get all users email addresses.
     * 
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
    "error": false,
    "message": "all user details found",
    "status": 200,
    "data": [
        {
            "email": "j@j.com"
        },
        {
            "email": "c@c.com"
        },
        {
            "email": "m@m.com"
        },
        {
            "email": "g@g.com"
        },
        {
            "email": "u@u.com"
        }
    }
    */


    app.post(`${baseURl}/using/email/updateUser`,userController.updateUserusingEmail);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/using/email/updateUser api to update user details using email.
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {any} options to be updated. (body params) (required)
     * @apiParam {any} options options to be update. (body params)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     {
    "error": false,
    "message": "update successfull",
    "status": 200,
    "data": {
        "ok": 1,
        "nModified": 0,
        "n": 1
    }
}
    */

    app.get(`${baseURl}/getinfo/using/token/:token`,userController.getUserInfousingResetToken);

        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {get}/api/v1/users/getinfo/using/token/:token api to get a user details using password reset token.
     * @apiParam {string} password reset token. (URL params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
    "error": false,
    "message": "user details found",
    "status": 200,
    "data": {
        "userId": "QTWguvRkA",
        "userType": "admin",
        "firstName": "test",
        "lastName": "Admin",
        "email": "test-admin@gmail.com",
        "countryCode": 91,
        "mobileNumber": 123,
        "createdOn": "2018-08-03T14:37:13.000Z",
        "PasswordResetToken": "pd-vRnsjy",
        "PasswordResetExpiration": "2018-08-03T18:25:24.841Z"
    }
}    */



        app.post(`${baseURl}/password/update`,userController.updateUserPassword)
    
        /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/password/update api to update a users password.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     {
    "error": false,
    "message": "update successfull",
    "status": 200,
    "data": {
        "ok": 1,
        "nModified": 0,
        "n": 1
    }
}
    */


}


module.exports = {
    setRouter:setRouter
}
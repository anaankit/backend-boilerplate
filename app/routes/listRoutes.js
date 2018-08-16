const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const appConfig = require('../../config/appconfig');
const userController = require('../controller/userController');
const authMiddleware = require('../middlewares/auth');
const listController = require('../controller/listController')

let setRouter = (app) =>{

    let baseUrl = `${appConfig.apiVersion}/list`;

    app.post(`${baseUrl}/create`,authMiddleware.isAuthorized,listController.createList);

        /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/list/create api to Create a new list.
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiParam {string} userId userId of the user (body params) (required)
     * @apiParam {string} List name  list Name of the user. (body params) (required)
     * @apiParam {Array} cards cards in the list. (body params)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     {
    "error": false,
    "message": "new list createed successfully",
    "status": 200,
    "data": {
        "listId": "Wz7DzFeDC",
        "userId": "fSa7gmc_o",
        "cards": [
            {
                "title": "My first card",
                "cardId": "huytrewqa",
                "subcard": [
                    {
                        "Cardtitle": "My first card",
                        "subCardTitle": "sub card of my first card"
                    },
                    {
                        "Cardtitle": "My first card",
                        "subCardTitle": "2nd sub card of my first card"
                    }
                ]
            }
        ],
        "createdOn": "2018-08-10T17:40:15Z",
        "_id": "5b6dcdffad8f662358c83a6b",
        "listName": "Ankit test",
        "__v": 0
    }
}
    */


    app.post(`${baseUrl}/getAll`,authMiddleware.isAuthorized,listController.getAllListOfUser);

    
        /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/list/getAll api to get all lists of a user using user Id.
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiParam {string} userId userId of the user (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     {
    "error": false,
    "message": "all lists found",
    "status": 200,
    "data": [
        {
            "listId": "vNs-vITMl",
            "userId": "CTJ9l6ruH",
            "cards": [
                {
                    "title": "test card",
                    "cardId": "f1-PL5eK-",
                    "done": "",
                    "subcard": []
                }
            ],
            "createdOn": "2018-08-15T07:31:09Z",
            "done": "(Done)",
            "_id": "5b73d6bdb1d9131cb4c07113",
            "listName": "gummm",
            "__v": 0
        }
    ]
}
    */


    app.post(`${baseUrl}/delete`,authMiddleware.isAuthorized,listController.deleteList);

        /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/list/delete api to delete a list using list Id
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiParam {string} listId listId of the list (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     {
    "error": false,
    "message": "delete successfull",
    "status": 200,
    "data": {
        "ok": 1,
        "n": 1
    }
}
    */


    app.post(`${baseUrl}/updateList/id`,authMiddleware.isAuthorized,listController.updateListUsingListId);
           /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/list/delete api to delete a list using list Id
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiParam {string} listId listId of the list (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     {
    "error": false,
    "message": "delete successfull",
    "status": 200,
    "data": {
        "ok": 1,
        "n": 1
    }
}
    */
    


    // app.post(`${baseUrl}/update/allLists`,authMiddleware.isAuthorized,listController.updateAllListsOfUser)
  

    app.post(`${baseUrl}/allList/delete`,authMiddleware.isAuthorized,listController.deleteAllListsOfUser)
            /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/list/allList/delete api to delete all the lists of a user
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiParam {string} userId userId of th user for whome all lists must be deleted (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     {
    "error": false,
    "message": "delete successfull",
    "status": 200,
    "data": {
        "ok": 1,
        "n": 1
    }
}
    */
 

}


module.exports = {
    setRouter:setRouter
}
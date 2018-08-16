// including all required 
const mongoose = require('mongoose');
const shortId = require('shortid');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const inputValidator = require('../libs/paramsValidationLib');
const tokenLib = require('../libs/tokenLib');
const check = require('../libs/checkLib');
const passwordLib = require('../libs/generatePasswordLib');
const time = require('../libs/timeLib');


// including all models
const authModel = mongoose.model('Auth');
const userModel = mongoose.model('User');
const listModel = mongoose.model('List');


let createList = (req,res) =>{

    let newList = new listModel({
        listId:shortId.generate(),
        listName:req.body.listName,
        userId:req.body.userId,
        cards:req.body.cards,
        createdOn:time.now()    
    })

    newList.save((err,result)=>{
        if(err){

            let apiResponse =  response.generate(true,'error in saving',400,null);
            res.send(apiResponse)

        }else{
            let apiResponse = response.generate(false,'new list createed successfully',200,result);
            res.send(apiResponse);
        }

    })

} //  end of create list


let getAllListOfUser = (req,res) =>{

    listModel.find({userId:req.body.userId})
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'unable to find details',400,null);
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false,'all lists found',200,result);
            res.send(apiResponse)
        }
    })
    
} //  end of get all list of user


let deleteList = (req,res) =>{
    listModel.deleteOne({listId:req.body.listId})
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'unable to delete',400,null);
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false,'delete successfull',200,result);
            res.send(apiResponse)
        }
    })
} // end of ddelete list

let updateListUsingListId = (req,res) =>{
    let options = req.body
    listModel.update({listId:req.body.listId},options)
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'unable to update details',400,null);
            res.send(apiResponse)
        }else{

            let apiResponse = response.generate(false,'details updated',200,result);
            res.send(apiResponse)

        }
    })
} // end of update list using listId

let updateAllListsOfUser = (req,res) =>{

    let options = req.body.listModel

listModel.update({userId:req.body.userId},options , {multi:true} )

.exec((err,result)=>{
    if(err){
        let apiResponse = response.generate(true,'unable to update details',400,null);
        res.send(apiResponse)
    }else{

        let apiResponse = response.generate(false,'details updated',200,result);
        res.send(apiResponse)

    }
})

} //  end of update all lists of user


let deleteAllListsOfUser = (req,res) =>{

    listModel.deleteMany({userId:req.body.userId})
    .exec((err,result)=>{

        if(err){
            let apiResponse = response.generate(true,'unable to delete details',400,null);
        res.send(apiResponse)
        }else{
        let apiResponse = response.generate(false,'all lists deleted',200,result);
        res.send(apiResponse)
        }

    })

}

module.exports = {
    createList:createList,
    getAllListOfUser:getAllListOfUser,
    deleteList:deleteList,
    updateListUsingListId:updateListUsingListId,
    updateAllListsOfUser:updateAllListsOfUser,
    deleteAllListsOfUser:deleteAllListsOfUser
}
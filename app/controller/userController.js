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

//singup function 
let signUpFucntion = (req,res) =>{

    let validateUserInput = () =>{

        return new Promise((resolve,reject)=>{

            if(req.body.email){

                if(!inputValidator.Email(req.body.email)){
                    let apiResponse = response.generate(true,'email not valid',400,null);
                    reject(apiResponse)
                }else if (check.isEmpty(req.body.password)){

                    let apiResponse = response.generate(true,'password missing',400,null);
                    reject(apiResponse);
                }else{
                    resolve(req);
                }

            }else{

                let apiResponse = response.generate(true,'Email missing',400,null)
                reject(apiResponse)
            }

        }) //  end of promise of validate user input

    } // end of validate user Input

    let createUser = () =>{ 

        return new Promise((resolve,reject)=>{

        userModel.findOne({email:req.body.email})
        .exec((err,result)=>{

            if(err){

                logger.error('Unable to search db error','create user',10);
                let apiResponse = response.generate(true,'serach error',400,null);
                reject(apiResponse);
            }else if(check.isEmpty(result)){
                id = shortId.generate();
                let newUser = new userModel({
                    userId:id,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: passwordLib.hashpassword(req.body.password),
                    email: req.body.email,
                    mobileNumber: req.body.mobileNumber,
                    countryCode:req.body.countryCode,
                    createdOn: time.now()
                })


                newUser.save((err,newUserDetails)=>{
                    if(err){
                        logger.error('error in saving the new userr', 'newuser', 10);
                        let apiResponse = response.generate(true, 'error in saving new user', 400, null);
                        reject(apiResponse);
                    }else{
                        let newUserObj = newUserDetails.toObject();
                        resolve(newUserObj);
                    } 
                })
            } else{
                
                logger.error('user already exists','create user',6);
                apiResponse = response.generate(true,'user already exists',400,null);
                reject(apiResponse)
            }

        })            

        }) //  end of promise for create user

    } // end of create user

    validateUserInput(req,res)
    .then(createUser)
    .then((resolve)=>{
        delete resolve.password
        delete resolve._V
        delete resolve._id
        let apiResponse = response.generate(false,'User Account successfully create',200,resolve);
        res.send(apiResponse)
    })
    .catch((err) => {
        console.log("errorhandler");
        console.log(err);
        res.status(err.status)
        res.send(err)
    })
    

} //  end of signup 



let loginFunction = (req,res) =>{

    let findUser = () =>{

        return new Promise((resolve,reject)=>{

            if(req.body.email){
            userModel.findOne({email:req.body.email})
            .exec((err,userDetails)=>{
                
                if (err) {
                    console.log(err)
                    logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                    /* generate the error message and the api response message here */
                    let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                    reject(apiResponse)
                    /* if Company Details is not found */
                } else if (check.isEmpty(userDetails)) {
                    /* generate the response and the console error message here */
                    logger.error('No User Found', 'userController: findUser()', 7)
                    let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                    reject(apiResponse)
                } else {
                    /* prepare the message and the api response here */
                    logger.info('User Found', 'userController: findUser()', 10)
                    resolve(userDetails)
                }    
                

            })
        }else{
            let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
        }
        })

    } // end of  find user

    let validatePassword = (retrievedUserDetails) =>{
        return new Promise((resolve,reject)=>{

            passwordLib.comparePassword(req.body.password,retrievedUserDetails.password,(err,match)=>{

                if(err){
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                }else if(match){
                    let userDetails = retrievedUserDetails.toObject()
                    delete userDetails.password
                    delete userDetails._id
                    delete userDetails.__v
                    delete userDetails.createdOn
                    delete userDetails.modifiedOn
                    resolve(userDetails)
                }else{
                    
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })

        })
    } //  end of validate password
    
    let generateToken = (userDetails) =>{

        return new Promise((resolve,reject)=>{
            tokenLib.generateToken(userDetails,(err,tokenDetails)=>{

                if(err){
                    
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                }else{
                    
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    } // end of generate token
    
    
    let saveToken = (tokenDetails) =>{

        return new Promise((resolve,reject)=>{

            authModel.findOne({userId:tokenDetails.userId})
            .exec((err,retreivedTokenDetails)=>{
                if(err){
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                }else if(check.isEmpty(retreivedTokenDetails)){

                    let newAuthToken = new authModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })

                    newAuthToken.save((err,newTokenDetails)=>{
                        if(err){
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        }else{
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }else{
                   retreivedTokenDetails.authToken = tokenDetails.token
                   retreivedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                   retreivedTokenDetails.tokenGenerationTime = time.now()
                   retreivedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } 
            })

        }) //  end of promise

    } // end of save token


    findUser(req,res)
    .then(validatePassword)
    .then(generateToken)
    .then(saveToken)
    .then((resolve)=>{
        let apiResponse = response.generate(false,'Login successfull',200,resolve)
        res.status(200)
        res.send(apiResponse)
    })
    .catch((err) => {
        console.log("errorhandler");
        console.log(err);
        res.status(err.status)
        res.send(err)
    })

} // end of login function

module.exports = {
    signup:signUpFucntion,
    login:loginFunction,

}

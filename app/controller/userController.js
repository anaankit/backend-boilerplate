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

let getUserDetails = (req,res) =>{

    userModel.find({userId:req.body.userId})
    .exec((err,result)=>{

        if(err){
            let apiResponse = response.generate(true,'error in searching for user',400,null);
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            let apiResponse = response.generate(true,'no such users exists',400,null);
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false,'user details found',200,result);
            res.send(apiResponse);
        }

    })
} //  end of get userDetails

let updateUser  = (req,res) =>{
    let options = req.body
    userModel.update({userId:req.body.userId},options)
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'error in searching for user',400,null);
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false,'user details updated',200,result);
            res.send(apiResponse);
        }
    })
} // end of update User

let updateUserusingEmail = (req,res) =>{
    let options = req.body
    userModel.update({email:req.body.email},options)
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'error in searching for user',400,null);
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            let apiResponse = response.generate(true,'no account found with email',400,null);
            res.send(apiResponse)
        }
        else{
            let apiResponse = response.generate(false,'user details updated',200,result);
            res.send(apiResponse);
        }
    })
} // end of update user using email


let updateListArr = (req,res) =>{

    userModel.findOne({userId:req.body.userId})
    .exec((err,result)=>{
        
        if(err){
            let apiResponse = response.generate(true,'error in searching for user',400,null);
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            let apiResponse = response.generate(true,'no such users exists',400,null);
            res.send(apiResponse)
        }else{
            
            // let abc = {
            //     indexPos:req.body.indexPos,
            //     hList:req.body.hList
            // }

            result.listArr.push(req.body.list);

            result.save((error,result)=>{

                if(error){
                    let apiResponse = response.generate(true,'error in saving in the array',400,null)
                    res.send(apiResponse)
                }else{
                    let apiResponse = response.generate(false,'update successfull',200,result);
                    res.send(apiResponse);
                }

            })

        }

        
    })
} // end of updateListArr

let updateIndex = (req,res)=>{

    userModel.findOneAndUpdate({userId:req.body.userId},{currentIndex:req.body.currentIndex})
    .exec((err,result)=>{
        if(err){

            let apiResponse = response.generate(true,'unable ,400,nullto update',400,null);
            res.send(apiResponse);

        }else{
            let apiResponse = response.generate(false,'update successfull',200,result);
            res.send(apiResponse);
        }
    })

} // end of  update index


let getUserUsingEmail = (req,res) =>{

    userModel.findOne({email:req.body.email})
    .select('-_id -__v -password -listArr')
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'unable to search',400,null);
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            let apiResponse = response.generate(true,'empty result returned',400,null);
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false,'user found',200,result);
            res.send(apiResponse);
        }
    })

}

let addFrndReq = (req,res) =>{

userModel.findOne({userId:req.body.userId})
.exec((err,result)=>{
    if(err){
        let apiResponse = response.generate(true,'db error occured',400,null);
        res.send(apiResponse);
    }else if(check.isEmpty(result)){
        let apiResponse = response.generate(true,'no such user found',400,null);
        res.send(apiResponse)
    }else{

        result.friendReq.push(req.body);

        result.save((error,results)=>{

            if(error){
                let apiResponse = response.generate(true,'unable to save',400,null);
                res.send(apiResponse)
            }else{
                let apiResponse = response.generate(false,'list updated successfully',200,results);
                res.send(apiResponse);
            }

        })

    }
})

} // end of add frnd request

let moveUser = (req,res) =>{

    userModel.findOne({userId:req.body.userId})
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'unable to search', 400, null);
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            let apiResponse = response.generate(true,'no such user exisits',400, null);
            res.send(apiResponse)
        }else{

            for(let each of result.friendReq){
                if(each.fromUserId == req.body.fromUserId){
                    let temp = each;
                    let index = result.friendReq.indexOf(each);
                    result.friendReq.splice(index,1);
                    result.friendList.push(temp);

                    result.save((error,results)=>{

                        // if(error){
                        //     let apiResponse = response.generate(true,'unable to save',400,null);
                        //     res.send(apiResponse)
                        // }else{
                        //     let apiResponse = response.generate(false,'details moved successfully',200,results)
                        //     res.send(apiResponse);
                        // }
                    })

                    userModel.findOne({userId:req.body.fromUserId})
                    .exec((e,r)=>{

                        if(e){
                            let apiResponse = response.generate(true,'unable to save',400,null);
                            res.send(apiResponse)
                        }else{
                            
                            let xyz = {
                                userId:req.body.fromUserId,
                                fromUserId: result.userId,
                                fromName:result.firstName+' '+result.lastName,
                                fromEmail:result.email
                            }

                            r.friendList.push(xyz);
                            r.save((er,re)=>{
                                if(er){
                                    let apiResponse = response.generate(true,'unable to save',400,null);
                                    res.send(apiResponse)
                                }else{
                                    let apiResponse = response.generate(false,'details moved successfully',200,re)
                                    res.send(apiResponse);
                                }
                            })
                        }

                    })

                }
            }

        }
    })
    
}

let getAllUsers  = (req,res) =>{

userModel.find()
.select('email')
.select('-_id')
.exec((err,result)=>{
    if(err){
        let apiResponse = response.generate(true,'error occured while searching',400,null);
        res.send(apiResponse)
    }else if(check.isEmpty(result)){
        let apiResponse = response.generate(true,'empty result returned',400,null);
        res.send(apiResponse)
    }else{
        let apiResponse = response.generate(false,'all user details found',200,result)
        res.send(apiResponse)
    }
})

} //  end of get all users


let getUserInfousingResetToken = (req,res) =>{
    userModel.findOne({PasswordResetToken:req.params.token})
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'error occured while searching',400,null);
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            let apiResponse = response.generate(true,'empty result returned',400,null);
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false,' user details found',200,result)
            res.send(apiResponse)
        }
    })
    
} // end of get user info using reset token

let updateUserPassword = (req,res) =>{
    userModel.update({email:req.body.email},{password:passwordLib.hashpassword(req.body.password)})
    .exec((err,result)=>{
        if(err){
            let apiResponse = response.generate(true,'error occured while searching',400,null);
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false,' user details updated',200,result)
            res.send(apiResponse)
        }
    })
} // end of update password

module.exports = {
    signup:signUpFucntion,
    login:loginFunction,
    getUserDetails:getUserDetails,
    updateUser:updateUser,
    updateListArr:updateListArr,
    updateIndex:updateIndex,
    getUserUsingEmail:getUserUsingEmail,
    addFrndReq:addFrndReq,
    moveUser:moveUser,
    getAllUsers:getAllUsers,
    updateUserusingEmail:updateUserusingEmail,
    updateUserPassword:updateUserPassword,
    getUserInfousingResetToken:getUserInfousingResetToken

}

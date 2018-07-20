const jwt = require('jsonwebtoken');
const shortId = require('shortid');
const secretKey = "thisissecret";
const logger = require('../libs/loggerLib');

let generateToken = (data,cb) =>{
    try{

        let claims = {
            jwtidd :shortId.generate(),
            iat:Date.now(),
            exp:Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            sub:'authToken',
            iss:'edChat',
            data:data
        }
        
        let tokenDetails = {
            token:jwt.sign(claims,secretKey),
            tokenSecret:secretKey
        }
        
        cb(null,tokenDetails)

    }catch(err){
        logger.error('error in generating token','generateToken',7);
        cb(err,null);
    }
} // end of generate token


let verifyClaim = (token,secretKey,cb) =>{
    jwt.verify(token,secretKey,function(err,decoded){
        if(err){
            logger.error('error while verifying token','verifyClaim',7);
            cb(err,null)
        }else{
            logger.info('user verified','verifyClaim',1);
            cb(null,decoded);
        }
    })
} // end of verify claims 

let verifyClaimWithoutSecret = (token,cb) =>{
    jwt.verify(token,secretKey,function(err,decoded){
        if(err){
            logger.error('error while verifying token','verifyClaim',7);
            cb(err,null)
        }else{
            logger.info('user verified','verifyClaim',1);
            cb(null,decoded);
        }
    })
}



module.exports = {
    generateToken:generateToken,
    verifyClaim:verifyClaim,
    verifyClaimWithoutSecret:verifyClaimWithoutSecret
}
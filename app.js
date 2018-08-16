// initilizing all required fields
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyparser =  require('body-parser');
const fs = require('fs');
const app = express();
const http = require('http');
const appConfig =  require('./config/appConfig');
const logger = require('./app/libs/loggerLib');
const routeLoggerMiddleware = require('./app/middlewares/routeLogger.js');
const globalErrorMiddleware = require('./app/middlewares/appErrorHandler');
const mongoose = require('mongoose');

// using all middlewares
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(routeLoggerMiddleware.logIp);
app.use(globalErrorMiddleware.globalErrorHandler);

// for static files like html and css
app.use(express.static(path.join(__dirname, 'client')));

// including all  paths
const modelsPath ='./app/models';
const routesPath = './app/routes';
const libsPath ='./app/libs';
const middlewarespath = './app/middlewares';

// bootstraping models
fs.readdirSync(modelsPath).forEach(function(file){
    if (~file.indexOf('.js')) require(modelsPath + '/' + file)
})


//bootstraping routes
fs.readdirSync(routesPath).forEach(function (file) {
    if (~file.indexOf('.js')) {
      let route = require(routesPath + '/' + file);
      route.setRouter(app);
    }
  });

  //calling global 404 error handler
  app.use(globalErrorMiddleware.globalNotFoundHandler);

  
  // creating http server
  const server = http.createServer(app);

  //start listening to server
  server.listen(appConfig.port);
  server.on('error',onError);
  server.on('listening', onListening)

// socket io connection handler if required  

const socketLib = require("./app/libs/socketLib");
const socketServer = socketLib.setServer(server);

// end of socket io coonnection haldler



//http  event listeners


function onError(error) {
    if (error.syscall !== 'listen') {
      logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
      throw error;
    }
  
  
    switch (error.code) {
        case 'EACCES':
          logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
          process.exit(1);
          break;
        default:
          logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
          throw error;
      }
    }
      
    function onListening() {
  
        var addr = server.address();
        var bind = typeof addr === 'string'
          ? 'pipe ' + addr
          : 'port ' + addr.port;
        ('Listening on ' + bind);
        logger.info('server listening on port' + addr.port, 'serverOnListeningHandler', 10);
        let db = mongoose.connect(appConfig.db.uri,{useNewUrlParser: true});
      }
      
      process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
        // application specific logging, throwing an error, or other logic here
      });

// database connection settings

mongoose.connection.on('error',function(err){

    logger.error(err,'mongoose connection',10);

  })

  mongoose.connection.on('open',function(err){
      if(err){
          logger.error(err,'mongoose connection',10);
      }else{
          logger.info('database connection successfull','mongoose connection',1);
      }
  })

  module.exports = app;
      
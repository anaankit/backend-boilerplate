const socketio = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const shortId = require('shortid');
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');

const events = require('events');
const eventsEmitter = new events.EventEmitter();
const tokenLib = require('../libs/tokenLib');
const response = require('../libs/responseLib');
// const nodeMailer = require('../libs/nodemailerLib')

let arr=[];

let setServer = (server) =>{

    let io=socketio.listen(server);
    let myIo = io.of('')

    myIo.on('connection',(socket)=>{
        // console.log('connected');
        socket.emit('send-userId','hi');

        socket.on('userId',(userId)=>{

            let abc = {
                userId:userId,
                socketId:socket.id
            }

            arr.push(abc);
            // console.log(arr);
        }) //  end of socket on userId

            socket.on('newChange',(details)=>{

                console.log(details.frndList)

                    for(let frnd of details.frndList){

                    for(let each of arr){

                        if(frnd.fromUserId==each.userId){
                            myIo.to(each.socketId).emit('change-made',details);
                        }
                    }
                    
                }

                for(let each of arr){
                    if(each.userId == details.userId){
                        myIo.to(each.socketId).emit('change-made',details);
                    }
                }

            }) // end of socket new change

            socket.on('undo',(uid)=>{

                for(let each of arr){
                    if(each.userId === uid){
                        myIo.to(each.socketId).emit('undoEvent',uid);
                    }
                }

            }) // end of undo

            socket.on('frndRequestSent',(id)=>{

                for(let each of arr){
                    if(each.userId == id){
                        myIo.to(each.socketId).emit('refresh',id);
                    }
                }

            }) // end of frnd request sent

            socket.on('requestAccepted',(data)=>{
                for(let each of arr){
                    if(each.userId == data.id){
                        myIo.to(each.socketId).emit('newFriend',data);
                    }
                }
            }) //  end of request accepted

            socket.on('mail',(data)=>{
                nodeMailer.sendMail(data);
            }) //  end of mail

            socket.on('disconnect',()=>{

                // console.log('a user is disconnected')

                for(let each of arr){

                    if(socket.id==each.socketId){

                        let index  = arr.indexOf(each);
                        // console.log(index);
                        arr.splice(index,1);
                        // console.log(arr);

                    }

                }

            })

         

    }) //  end of myio on connection

}// end of set server



module.exports = {
    setServer:setServer
}
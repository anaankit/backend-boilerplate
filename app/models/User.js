const mongoose = require('mongoose');
Schema = mongoose.Schema;

let userSchema =  new Schema({

    userId:{
        type:String,
        unique:true,
        index:true,
        default:''
    },
    firstName:{
        type:String,
        default:''
    },
    lastName:{
        type:String,
        default:''
    },
    password:{
        type:String,
        default:'password'
    },
    email:{
        type:String,
        default:'',
        unique:true
    },
    mobileNumber:{
        type:Number,
        default:0
    },
    countryCode:{
        type:Number,
        default:91
    },
    createdOn:{
        type:Date,
        default:""
    },
    currentIndex:{
        type:Number,
        default:0
    },
    listArr:{
        type:Array,
        default:[]
    },
    friendReq:{
        type:Array,
        default:[]
    },
    friendList:{
        type:Array,
        default:[]
    },
    PasswordResetToken:{
        type:String,
        default:''
    },
    PasswordResetExpiration:{
        type:String,
        default:''
    }

})

mongoose.model('User',userSchema);
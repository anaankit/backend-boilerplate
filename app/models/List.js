const mongoose = require('mongoose');
Schema = mongoose.Schema

// let subcards = [{
//     cardTitle:String,
//     subcardTitle:String
// }]

let listSchema = new Schema({

    listId:{
        type:String,
        default:''
    },
    listName:{
        type:String,
        degault:''
    },
    userId:{
        type:String,
        default:''
    },
    cards:{
        type:Array,
    
    },
    createdOn:{
        type:String,
        default:''
    },
    done:{
        type:String,
        default:''
    }

})


mongoose.model('List',listSchema);
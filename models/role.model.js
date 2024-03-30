const mongoose = require('mongoose');

const RoleSchema  = new mongoose.Schema({

    name:{
        type:String,
    },
    permissions:[
        {
            type:String
        }
    ],
    created:{
        type:Date,
        default:Date.now
    },
    updated:{
        type:Date,
        default:Date.now
    }

})

module.exports  = mongoose.model("Role",RoleSchema);
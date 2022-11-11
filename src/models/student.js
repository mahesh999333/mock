const mongoose = require('mongoose');
const ObjectId=mongoose.Schema.Types.ObjectId


let student = new mongoose.Schema({
    name:{
        type:String
    },
    data: [
        {
            sub:{type:String},
            marks:{type:Number},
            _id:false
        }
    ],
    professorId:{
        type:ObjectId,
        require:true
    },
    isDeleted: {
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports = mongoose.model('Student', student);






const mongoose = require('mongoose');


let professor = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true
    },
    passowrd:{
        type:String,
        require:true
    }
},{timestamps:true})

module.exports = mongoose.model('Professor', professor);
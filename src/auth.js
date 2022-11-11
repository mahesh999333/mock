const jwt = require('jsonwebtoken');
const professorModel = require('./models/professor');
const mongoose = require('mongoose');




const authentication = async (req, res, next) => {
    try{
        let token = req.headers['x-api-key'] || req.headers["X-API-KEY"];
        if(!token){
            return res.status(400).send({message:"token must be present"})
        }

        let decoded = jwt.verify(token, "mockAssignment secret key");
        if(!decoded){
            return res.status(401).send({message:"Toekn is invalid"})
        }else{
            req.token = decoded;
            console.log("authentication")
            next();
        }
    }
    catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


const authorization = async (req, res, next) => {
    try{
        let professorId = req.params.professorId;
        let loggedInId = req.token.professorId;
        
        // if(!mongoose.Types.ObjectId.isValid(professorId)){
        //     return res.status(400).send({message:"Please enter valid professor id"})
        // }

        // let professor = await professorModel.findOne({_id:professorId});
        // if(!professor){
        //     return res.status(404).send({message:"Professor does not exist"})
        // }

        if(loggedInId != professorId){
            return res.status(403).send({message:"Authorisation failed"})
        }
        console.log("authorization")
        next();
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
      }
};

module.exports = {authentication, authorization};
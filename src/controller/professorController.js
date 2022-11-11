const professorModel = require("../models/professor");
const jwt = require("jsonwebtoken");
const {
  isValidRequest,
  isValidMail,
  isValidPassword,
  isValidName,
} = require("../validator");

const createProfessor = async (req, res) => {
  try {
    //validating the body part if the body is empty
    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a Valid Input" });
    }

    let { name, email, password } = req.body;
    let professor = {};

    if (name) {
      name = name.trim();
      if (!isValidName(name)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a Valid Name" });
      } else {
        professor.name = name;
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    }

    //email validation
    if (email) {
      email = email.trim();
      if (!isValidMail(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a valid email" });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Email is required" });
    }

    //checking for duplicacy of eamil
    const isDuplicate = await professorModel.findOne({ email: email });
    if (isDuplicate) {
      return res
        .status(409)
        .send({ status: false, message: `${email}email already in use` });
    }

    professor.email = email;

    //password validation
    if (password) {
      password = password.trim();
      if (!isValidPassword(password)) {
        return res.status(400).send({
          status: false,
          message:
            "Password should contain min 8 and max 15 characters a number and a special character",
        });
      } else {
        professor.password = password;
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    }
    console.log(professor)
    //creating user data
    const newProfessor = await professorModel.create(professor);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: newProfessor });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const login = async (req, res) => {
    try{
        if(!isValidRequest(req.body)){
            return res
            .status(400)
            .send({ status: false, message: "Enter a Valid Input" });
        }

        let {email, password} = req.body;

        let professor = await professorModel.findOne({email:email, password:password});
        console.log(professor.passowrd)
        if(!professor){
            return res.send(400).send({status:false, message:"PLease enter correct email or password"})
        }

        // JWT Creation
        let token = jwt.sign(
            {
                professorId:professor._id.toString(),
            },
            "mockAssignment secret key"
        );
        res.header("x-api-key", token)
        
        return res.status(200).send({message:"Successfully Login", data:token})

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
      }
}




module.exports = { createProfessor, login };

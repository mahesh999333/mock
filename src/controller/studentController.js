// add API
// update
// delete

// get all students API has 2 filters
// filter by name
// filter by subject

// update by id
// // delete
// add new
const mongoose = require("mongoose");
const studentModel = require("../models/student");
const { isValidRequest, isValidName } = require("../validator");

const createStudent = async (req, res) => {
  try {
    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a Valid Input" });
    }

    let { name, sub, marks, professorId } = req.body;

    if (name) {
      name = name.trim();
      if (!isValidName(name)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a Valid Name" });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    }

    if (sub) {
      sub = sub.trim();
      if (!isValidName(sub)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a Valid sub" });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Subject is required" });
    }

    if (marks) {
      if (marks < 0 || marks > 100) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid marks" });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Marks is required" });
    }
    

    let data = {
      name: name,
      data: { sub: sub, marks: marks },
      professorId: professorId,
    };
    let student = await studentModel.findOne({
      professorId: professorId,
      name: name,
    }); // give mongoDB obj
    console.log(student);
    if (student) {
      let studentDataArr = student.data; // array of data
      //console.log(typeof studentDataArr)
      for (let obj of studentDataArr) {
        if (obj.sub == sub) {
          // student found with same professor, studentname, and subject, noew update the marks
          obj.marks += marks;
          let data = {
            name: name,
            data: studentDataArr,
            professorId: professorId,
          };
          let update = await studentModel.findOneAndUpdate(
            { professorId: professorId, name: name },
            data,
            { new: true }
          );
          //console.log(update)
          return res.send({ data: update });
        }
      }
      // student found with same professor and studentname only so need to add new sub and its marks
      let newSub = { sub: sub, marks: marks };
      studentDataArr.push(newSub);
      let data = {
        name: name,
        data: studentDataArr,
        professorId: professorId,
      };
      let studentEntry = await studentModel.findOneAndUpdate(
        { professorId: professorId, name: name },
        data,
        { new: true }
      );
      return res.status(200).send({ data: studentEntry });
    } else {
      let studentEntry = await studentModel.create(data);
      return res.status(201).send({ data: studentEntry });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateMarks = async (req, res) => {
  try {
    if (!isValidRequest(req.body)) {
      return res.status(400).send({
        message: "Subject, Student Name, Marks and Professor ID is must",
      });
    }
    let { sub, name, marks, professorId } = req.body;

    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a Valid Input" });
    }

    if (name) {
      name = name.trim();
      if (!isValidName(name)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a Valid Name" });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    }

    if (sub) {
      sub = sub.trim();
      if (!isValidName(sub)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a Valid sub" });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Subject is required" });
    }

    if (marks) {
      if (marks < 0 || marks > 100) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid marks" });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Marks is required" });
    }
    if (professorId) {
      if (!mongoose.Types.ObjectId.isValid("professorId")) {
        return res.status(400).send({ message: "Provide valid professorId" });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, message: "professorId is required" });
    }

    // let student = await studentModel.findOne({name:name, professorId:professorId})
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getByStudentName = async (req, res) => {
  try {
    let name = req.query.name;
    if (!isValidName) {
      return res.status(400).send({ message: "Provide valid name" });
    }

    let data = await studentModel.find({ name: name });
    if (data.length == 0) {
      return res.status(404).send({ message: "No Data Found" });
    }

    res.status(200).send({ data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const deleteByStudentName = async (req, res) => {
  try {
    const name = req.query.name;
    let professorId = req.token.professorId;

    let student = await studentModel.findOne({name:name,professorId:professorId, isDeleted:false});
    if(!student){
        return res.status(404).send({message:"Student Not Found"})
    }
    console.log(student.professorId.toString() , professorId)
    if(student.professorId.toString() != professorId){
        return res.status(400).send({message:"ProfessorId is wrong"})
    }

    await studentModel.findOneAndUpdate({name:name,professorId:professorId, isDeleted:false},
       {$set:{isDeleted:true}});
       console.log('deleting')
       return res.status(200).send({message:"Student deleted successfully"})
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createStudent, getByStudentName ,deleteByStudentName};

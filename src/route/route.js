const express = require('express');
const route = express.Router();


const {createProfessor, login} = require('../controller/professorController')
const {createStudent, getByStudentName, deleteByStudentName} = require('../controller/studentController');
const {authentication, authorization} = require('../auth')


//Professor APIs
route.post('/register', createProfessor);
route.post('/login', login);

// Student APIs
route.post('/data/student/:professorId', authentication, authorization,createStudent);
route.get('/studentName', authentication, getByStudentName)
route.delete('/studentName/:professorId', authentication,authorization, deleteByStudentName)


module.exports = route;
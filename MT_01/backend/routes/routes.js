const express = require('express');
const router = express.Router();

const controllers = require('../controller/controllers.js');
const { validateStudent } = require('../validators/validateStudents.js');
const { validateID } = require('../validators/validateID.js');

router.get('/students', controllers.getAllStudents);
router.get('/students/:id', validateID, controllers.getStudentID);

router.post('/students', validateStudent, controllers.createStudent);
router.put('/students/:id', validateID, validateStudent, controllers.updateStudent);
router.delete('/students/:id', validateID, controllers.deleteStudent);

module.exports = router;
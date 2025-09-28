const model = require('../model/studentModel');

function generateStudentID() {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000); 
  return `${year}${random}`; 
}

async function generateUniqueStudentID() {
  let id;
  let exists = true;

  while (exists) {
    id = generateStudentID();
    exists = await model.Student.exists({ id });
  }

  return id;
}

const getAllStudents = async () => {
    return await model.Student.find({});
};

const getStudentByID = async (id) => {
    return await model.Student.findOne({ id});
}

const createStudent = async (studentData) => {

    const studentWithID = {
        ...studentData,
        id: generateUniqueStudentID()
    }

    const newStudent = new model.Student(studentWithID);
    return await newStudent.save();
};

const updateStudent = async (id, studentData) => {
    return await model.Student.findOneAndUpdate({id}, studentData, {new: true});
};

const deleteStudent = async (id) => {
    return await model.Student.findOneAndDelete({id});
}

module.exports = {
    getAllStudents,
    getStudentByID,
    createStudent,
    updateStudent,
    deleteStudent   
}
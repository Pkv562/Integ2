const service = require('../services/services.js');

const getAllStudents = async (req, res) => {
  try {
    const students = await service.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getStudentID = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await service.getStudentByID(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createStudent = async (req, res) => {
  try {
    const newStudent = await service.createStudent(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedStudent = await service.updateStudent(id, req.body);
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedStudent = await service.deleteStudent(id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllStudents,
  getStudentID,
  createStudent,
  updateStudent,
  deleteStudent
};

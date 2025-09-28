const service = require('../services/services.js');

const getAllStudents = async (req, res) =>  {
    try {
        const res = await service.getAllStudents();
        res.status(200).json(res);
    }
    catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const getStudentID = async (req, res) => {
    try {
        const id = req.params.id;
        const res = await service.getStudentByID(id);
        if (!res) {
            return res.status(404).json({error: 'Student not found'});
        } else {
            return res.status(200).json(res);
        }
    }
    catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const createStudent = async (req, res) => {
    try {
        const res = await service.createStudent(req.body);
        res.status(201).json(res);
    }
    catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const updateStudent = async (req, res) => {
    try {
        const id = req.params.id;
        const res = await service.updateStudent(id, req.body);
        if (!res) {
            return res.status(404).json({error: 'Student not found'});
        } else {
            return res.status(200).json(res);
        }
    }
    catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const deleteStudent = async (req, res) => {
    try {
        const id = req.params.id;
        const res = await service.deleteStudent(id);
        if (!res) {
            return res.status(404).json({error: 'Student not found'});
        }
        else {
            return res.status(200).json({message: 'Student deleted successfully'});
        }
    }
    catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
};

module.exports = {
    getAllStudents,
    getStudentID,
    createStudent,
    updateStudent,
    deleteStudent
}
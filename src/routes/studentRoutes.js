const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { validateStudentData, validateRegNoParam } = require('../middlewares/validation');

/**
 * Student Routes
 * Base Path: /students
 */

// Create a new student
router.post('/', validateStudentData, studentController.createStudent);

// Get all students with pagination
router.get('/', studentController.getAllStudents);

// Get a student by registration number
router.get('/:regNo', validateRegNoParam, studentController.getStudentByRegNo);

// Update a student by registration number
router.put('/:regNo', validateRegNoParam, validateStudentData, studentController.updateStudent);

// Delete a student by registration number
router.delete('/:regNo', validateRegNoParam, studentController.deleteStudent);

module.exports = router; 
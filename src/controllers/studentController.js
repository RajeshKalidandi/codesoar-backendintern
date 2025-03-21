const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Student Controller - Handles all student-related operations
 */
const studentController = {
  /**
   * Create a new student
   * @route POST /students
   */
  createStudent: async (req, res) => {
    try {
      const { registrationNo, name, class: className, rollNo, contactNumber } = req.body;

      // Check if a student with the same registration number already exists
      const existingStudent = await prisma.student.findUnique({
        where: { registrationNo }
      });

      if (existingStudent) {
        return res.status(409).json({ 
          error: 'Student with this registration number already exists' 
        });
      }

      // Check if a student with the same class and roll number exists
      const studentWithSameRoll = await prisma.student.findFirst({
        where: {
          class: className,
          rollNo: parseInt(rollNo)
        }
      });

      if (studentWithSameRoll) {
        return res.status(409).json({ 
          error: `Roll number ${rollNo} is already assigned in class ${className}` 
        });
      }

      // Create the new student
      const newStudent = await prisma.student.create({
        data: {
          registrationNo,
          name,
          class: className,
          rollNo: parseInt(rollNo),
          contactNumber,
          status: true
        }
      });

      return res.status(201).json({
        message: 'Student created successfully',
        data: newStudent
      });
    } catch (error) {
      console.error('Error creating student:', error);
      return res.status(500).json({ 
        error: 'Failed to create student',
        details: error.message
      });
    }
  },

  /**
   * Get all students with optional pagination
   * @route GET /students
   */
  getAllStudents: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      
      // Validation
      if (pageNumber < 1 || limitNumber < 1) {
        return res.status(400).json({ error: 'Page and limit must be positive integers' });
      }

      // Build the where condition
      const where = {};
      if (status !== undefined) {
        where.status = status === 'true' || status === '1';
      }

      // Get total count for pagination
      const totalStudents = await prisma.student.count({ where });
      
      // Get students with pagination
      const students = await prisma.student.findMany({
        where,
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        orderBy: { name: 'asc' }
      });

      return res.status(200).json({
        data: students,
        meta: {
          total: totalStudents,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalStudents / limitNumber)
        }
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch students',
        details: error.message
      });
    }
  },

  /**
   * Get a student by registration number
   * @route GET /students/:regNo
   */
  getStudentByRegNo: async (req, res) => {
    try {
      const { regNo } = req.params;

      const student = await prisma.student.findUnique({
        where: { registrationNo: regNo }
      });

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      return res.status(200).json({ data: student });
    } catch (error) {
      console.error('Error fetching student:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch student',
        details: error.message
      });
    }
  },

  /**
   * Update a student by registration number
   * @route PUT /students/:regNo
   */
  updateStudent: async (req, res) => {
    try {
      const { regNo } = req.params;
      const { name, class: className, rollNo, contactNumber, status } = req.body;

      // Check if the student exists
      const existingStudent = await prisma.student.findUnique({
        where: { registrationNo: regNo }
      });

      if (!existingStudent) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // If updating roll number or class, check for uniqueness
      if ((className || existingStudent.class) && (rollNo || existingStudent.rollNo)) {
        const classToCheck = className || existingStudent.class;
        const rollToCheck = parseInt(rollNo) || existingStudent.rollNo;
        
        const studentWithSameRoll = await prisma.student.findFirst({
          where: {
            class: classToCheck,
            rollNo: rollToCheck,
            registrationNo: { not: regNo }
          }
        });

        if (studentWithSameRoll) {
          return res.status(409).json({
            error: `Roll number ${rollToCheck} is already assigned in class ${classToCheck}`
          });
        }
      }

      // Update the student
      const updatedStudent = await prisma.student.update({
        where: { registrationNo: regNo },
        data: {
          ...(name && { name }),
          ...(className && { class: className }),
          ...(rollNo && { rollNo: parseInt(rollNo) }),
          ...(contactNumber && { contactNumber }),
          ...(status !== undefined && { status: Boolean(status) })
        }
      });

      return res.status(200).json({
        message: 'Student updated successfully',
        data: updatedStudent
      });
    } catch (error) {
      console.error('Error updating student:', error);
      return res.status(500).json({ 
        error: 'Failed to update student',
        details: error.message
      });
    }
  },

  /**
   * Delete a student by registration number (soft delete)
   * @route DELETE /students/:regNo
   */
  deleteStudent: async (req, res) => {
    try {
      const { regNo } = req.params;
      const { permanent } = req.query;

      // Check if the student exists
      const existingStudent = await prisma.student.findUnique({
        where: { registrationNo: regNo }
      });

      if (!existingStudent) {
        return res.status(404).json({ error: 'Student not found' });
      }

      if (permanent === 'true') {
        // Permanent deletion
        await prisma.student.delete({
          where: { registrationNo: regNo }
        });

        return res.status(200).json({
          message: 'Student permanently deleted'
        });
      } else {
        // Soft deletion (update status to false)
        await prisma.student.update({
          where: { registrationNo: regNo },
          data: { status: false }
        });

        return res.status(200).json({
          message: 'Student deactivated successfully'
        });
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      return res.status(500).json({ 
        error: 'Failed to delete student',
        details: error.message
      });
    }
  }
};

module.exports = studentController; 
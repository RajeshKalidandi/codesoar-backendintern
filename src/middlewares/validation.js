/**
 * Middleware for validating student data
 */

// Validate the student registration number format
const validateRegistrationNo = (regNo) => {
  // Assuming a registration number format of 'REG-YYYY-XXXX'
  const regNoPattern = /^REG-\d{4}-\d{4}$/;
  return regNoPattern.test(regNo);
};

// Validate the student contact number
const validateContactNumber = (contactNo) => {
  // Simple validation for a 10-digit phone number
  const contactPattern = /^\d{10}$/;
  return contactPattern.test(contactNo);
};

// Middleware for validating student data on create
const validateStudentData = (req, res, next) => {
  const { registrationNo, name, class: className, rollNo, contactNumber } = req.body;
  const errors = [];
  const isUpdate = req.method === 'PUT';

  // Check required fields (only for POST, not for PUT)
  if (!isUpdate) {
    if (!registrationNo) errors.push('Registration number is required');
    if (!name) errors.push('Name is required');
    if (!className) errors.push('Class is required');
    if (!rollNo) errors.push('Roll number is required');
    if (!contactNumber) errors.push('Contact number is required');
  }

  // Validate registration number format
  if (registrationNo && !validateRegistrationNo(registrationNo)) {
    errors.push('Invalid registration number format. Expected: REG-YYYY-XXXX');
  }

  // Validate roll number
  if (rollNo && (isNaN(rollNo) || rollNo <= 0)) {
    errors.push('Roll number must be a positive integer');
  }

  // Validate contact number
  if (contactNumber && !validateContactNumber(contactNumber)) {
    errors.push('Contact number must be a 10-digit number');
  }

  // If there are validation errors, return a 400 response
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // If all validations pass, proceed to the next middleware/controller
  next();
};

// Middleware for validating registration number in URL parameter
const validateRegNoParam = (req, res, next) => {
  const { regNo } = req.params;
  
  if (!regNo) {
    return res.status(400).json({ errors: ['Registration number is required'] });
  }

  if (!validateRegistrationNo(regNo)) {
    return res.status(400).json({ 
      errors: ['Invalid registration number format. Expected: REG-YYYY-XXXX'] 
    });
  }

  next();
};

module.exports = {
  validateStudentData,
  validateRegNoParam
}; 
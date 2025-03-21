# School Management System - Student Module

A RESTful API for managing student records in a school management system, built with Node.js, Express, and Prisma ORM.

## Features

- **Student Management**: Create, read, update, and delete student records
- **Data Validation**: Input validation for all API endpoints
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **Pagination**: Pagination support for listing students
- **Soft Deletion**: Option for soft deletion of student records

## Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- PostgreSQL, MySQL, or MongoDB database

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/school-management-system.git
   cd school-management-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy the `.env.example` file to `.env`
   - Update the `DATABASE_URL` in the `.env` file with your database connection string

4. Generate Prisma client:
   ```
   npm run prisma:generate
   ```

5. Run database migrations:
   ```
   npm run prisma:migrate
   ```

## Running the Application

### Development Mode
```
npm run dev
```

The server will start at http://localhost:3000 with hot reloading enabled.

### Production Mode
```
npm start
```

## API Endpoints

### Create Student
- **Endpoint**: `POST /students`
- **Description**: Adds a new student record to the database
- **Request Body**:
  ```json
  {
    "registrationNo": "REG-2023-0001",
    "name": "John Doe",
    "class": "10A",
    "rollNo": 12,
    "contactNumber": "1234567890"
  }
  ```

### Get All Students
- **Endpoint**: `GET /students`
- **Description**: Retrieves all student records with pagination
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of records per page (default: 10)
  - `status`: Filter by student status (`true` or `false`)

### Get Student by Registration Number
- **Endpoint**: `GET /students/:regNo`
- **Description**: Fetches a specific student's details using their registration number

### Update Student
- **Endpoint**: `PUT /students/:regNo`
- **Description**: Updates the details of an existing student
- **Request Body**: Same as Create Student (all fields are optional for update)

### Delete Student
- **Endpoint**: `DELETE /students/:regNo`
- **Description**: Deactivates or permanently deletes a student
- **Query Parameters**:
  - `permanent`: Whether to permanently delete the student (`true` or `false`, default: `false`)

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid input data
- `404 Not Found`: Student not found
- `409 Conflict`: Duplicate registration number or roll number
- `500 Internal Server Error`: Server-side errors

## Database Schema

The database schema includes a `Student` model with the following fields:

- `id`: Integer, auto-increment, primary key
- `registrationNo`: String, unique, required
- `name`: String, required
- `class`: String, required
- `rollNo`: Integer, required
- `contactNumber`: String, required
- `status`: Boolean, default: true

## License

This project is licensed under the ISC License.

## Author

Your Name 
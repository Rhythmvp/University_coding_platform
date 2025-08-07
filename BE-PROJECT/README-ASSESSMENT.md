# Assessment System Documentation

## Overview
This assessment system provides a comprehensive platform for creating and managing educational assessments with both MCQ and coding questions. It supports two user roles: Admin and Consumer (Student).

## Features

### Admin Features
- **Dashboard**: Overview of assessment statistics and recent submissions
- **Assessment Management**: Create, edit, and delete assessments
- **Reports**: View detailed performance analytics and student submissions
- **Question Types**: Support for MCQ and coding questions
- **Real-time Monitoring**: Track student progress and performance

### Consumer (Student) Features
- **Assessment Browser**: View available assessments
- **Live Coding Interface**: Integrated code editor for programming questions
- **Timer**: Time-limited assessments with countdown
- **Progress Tracking**: Real-time progress indicator
- **Question Navigation**: Easy navigation between questions

## User Roles

### Admin
- Can create and manage assessments
- View detailed reports and analytics
- Monitor student performance
- Access admin dashboard

### Consumer (Student)
- Can take assessments
- View available assessments
- Submit answers and code solutions
- Track progress and scores

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Admin User**
   ```bash
   npm run create-admin
   ```
   This creates an admin user with:
   - Username: `admin`
   - Password: `admin123`

3. **Start the Server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

4. **Access the Application**
   - Open `http://localhost:8080`
   - Login with admin credentials to access admin features
   - Register new users for consumer access

## Assessment Types

### MCQ Assessments
- Multiple choice questions with 4 options
- Configurable points per question
- Automatic scoring

### Coding Assessments
- Programming questions with test cases
- Support for multiple programming languages
- Integrated code editor
- Test case validation

### Mixed Assessments
- Combination of MCQ and coding questions
- Flexible question configuration

## API Endpoints

### Admin Endpoints
- `GET /api/admin/assessments` - Get all assessments
- `POST /api/admin/assessments` - Create new assessment
- `PUT /api/admin/assessments/:id` - Update assessment
- `DELETE /api/admin/assessments/:id` - Delete assessment
- `GET /api/admin/submissions` - Get all submissions
- `GET /api/admin/assessments/:id/stats` - Get assessment statistics

### Consumer Endpoints
- `GET /api/assessments` - Get available assessments
- `GET /api/assessments/:id` - Get assessment details
- `POST /api/assessments/:id/submit` - Submit assessment answers

## Database Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String,
  role: String (enum: ['admin', 'consumer'])
}
```

### Assessment Model
```javascript
{
  title: String,
  description: String,
  type: String (enum: ['mcq', 'coding']),
  questions: Array,
  codingQuestions: Array,
  timeLimit: Number,
  isActive: Boolean,
  createdBy: ObjectId
}
```

### Submission Model
```javascript
{
  assessment: ObjectId,
  student: ObjectId,
  answers: Array,
  codingSubmissions: Array,
  totalScore: Number,
  maxScore: Number,
  timeTaken: Number,
  status: String,
  completedAt: Date
}
```

## Usage Examples

### Creating an Assessment (Admin)
1. Login as admin
2. Navigate to Admin Dashboard
3. Click "Create Assessment"
4. Fill in assessment details
5. Add MCQ and/or coding questions
6. Set time limit and status
7. Save assessment

### Taking an Assessment (Student)
1. Login as student
2. Navigate to Assessment section
3. Select an assessment
4. Answer MCQ questions
5. Write code for programming questions
6. Submit assessment before time expires

## Security Features
- Role-based access control
- Session management
- Input validation
- Admin-only routes protection

## Future Enhancements
- Real-time code execution
- Advanced analytics and charts
- Bulk assessment import/export
- Email notifications
- Mobile-responsive design improvements
- Integration with external code execution services

## Troubleshooting

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running
2. **Admin Access**: Run `npm run create-admin` to create admin user
3. **Session Issues**: Clear browser cookies if login problems occur
4. **Assessment Not Loading**: Check if assessment is marked as active

### Support
For technical support, check the server logs and ensure all dependencies are properly installed. 
const mongoose = require('mongoose');
const Assessment = require('./db/models/Assessment');
const User = require('./db/models/User');
const connectDB = require('./db/config');

async function createTestAssessment() {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Find admin user
        const admin = await User.findOne({ username: 'admin' });
        if (!admin) {
            console.log('Admin user not found. Please run npm run create-admin first.');
            process.exit(1);
        }
        
        // Check if test assessment already exists
        const existingTest = await Assessment.findOne({ title: 'Test Assessment' });
        if (existingTest) {
            console.log('Test assessment already exists');
            process.exit(0);
        }
        
        // Create test assessment
        const testAssessment = new Assessment({
            title: 'Test Assessment',
            description: 'A test assessment with both MCQ and coding questions',
            type: 'mixed',
            questions: [
                {
                    question: 'What is 2 + 2?',
                    options: ['3', '4', '5', '6'],
                    correctAnswer: '4',
                    points: 5
                },
                {
                    question: 'Which programming language is this assessment built with?',
                    options: ['Python', 'JavaScript', 'Java', 'C++'],
                    correctAnswer: 'JavaScript',
                    points: 5
                }
            ],
            codingQuestions: [
                {
                    title: 'Hello World',
                    description: 'Write a function that returns "Hello World"',
                    difficulty: 'easy',
                    starterCode: 'function helloWorld() {\n    // Write your code here\n}',
                    points: 10,
                    testCases: [
                        {
                            input: '',
                            output: 'Hello World',
                            description: 'Basic test case'
                        }
                    ]
                }
            ],
            timeLimit: 30,
            isActive: true,
            createdBy: admin._id
        });
        
        await testAssessment.save();
        console.log('Test assessment created successfully!');
        console.log('Assessment ID:', testAssessment._id);
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating test assessment:', error);
        process.exit(1);
    }
}

createTestAssessment(); 
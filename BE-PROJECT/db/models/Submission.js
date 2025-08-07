const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [{
        questionIndex: Number,
        selectedAnswer: String,
        isCorrect: Boolean,
        points: Number
    }],
    codingSubmissions: [{
        questionIndex: Number,
        code: String,
        language: {
            type: String,
            default: 'javascript'
        },
        testResults: [{
            testCase: Number,
            passed: Boolean,
            output: String,
            expectedOutput: String
        }],
        points: Number
    }],
    totalScore: {
        type: Number,
        default: 0
    },
    maxScore: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number, // in minutes
        default: 0
    },
    completedAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'timeout'],
        default: 'in-progress'
    }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema); 
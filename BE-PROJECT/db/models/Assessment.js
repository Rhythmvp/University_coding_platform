const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['mcq', 'coding'],
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [{
            type: String
        }],
        correctAnswer: {
            type: String
        },
        points: {
            type: Number,
            default: 1
        }
    }],
    codingQuestions: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'easy'
        },
        testCases: [{
            input: String,
            output: String,
            description: String
        }],
        starterCode: {
            type: String,
            default: ''
        },
        points: {
            type: Number,
            default: 10
        }
    }],
    timeLimit: {
        type: Number, // in minutes
        default: 60
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema); 
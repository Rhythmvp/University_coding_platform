const express = require('express');
const router = express.Router();
const Assessment = require('../db/models/Assessment');
const Submission = require('../db/models/Submission');
const User = require('../db/models/User');

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ error: 'Admin access required' });
};

// Middleware to check if user is authenticated
const checkAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).json({ error: 'Authentication required' });
};

// Get all assessments (for consumers)
router.get('/assessments', checkAuth, async (req, res) => {
    try {
        const assessments = await Assessment.find({ isActive: true })
            .populate('createdBy', 'username')
            .select('-questions.correctAnswer');
        res.json(assessments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get assessment by ID (for consumers)
router.get('/assessments/:id', checkAuth, async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id)
            .populate('createdBy', 'username');
        
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }

        // Remove correct answers for consumers
        const assessmentForStudent = {
            ...assessment.toObject(),
            questions: assessment.questions.map(q => ({
                question: q.question,
                options: q.options,
                points: q.points
            }))
        };

        res.json(assessmentForStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit assessment answers
router.post('/assessments/:id/submit', checkAuth, async (req, res) => {
    try {
        const { answers, codingSubmissions, timeTaken } = req.body;
        const assessmentId = req.params.id;
        const studentId = req.session.user.id;

        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }

        // Debug logs
        console.log('Received answers:', answers);
        console.log('Assessment correct answers:', assessment.questions.map(q => q.correctAnswer));

        // Calculate score
        let totalScore = 0;
        const processedAnswers = [];

        // Process MCQ answers
        if (answers && assessment.questions) {
            answers.forEach((answer, index) => {
                const question = assessment.questions[index];
                if (question) {
                    // Defensive: if answer is null/undefined, treat as incorrect
                    const selected = answer && answer.selectedAnswer ? answer.selectedAnswer : null;
                    const isCorrect = selected === question.correctAnswer;
                    const points = isCorrect ? question.points : 0;
                    totalScore += points;

                    processedAnswers.push({
                        questionIndex: index,
                        selectedAnswer: selected,
                        isCorrect,
                        points
                    });
                }
            });
        }

        // Process coding submissions
        const processedCodingSubmissions = [];
        if (codingSubmissions && assessment.codingQuestions) {
            for (let i = 0; i < codingSubmissions.length; i++) {
                const submission = codingSubmissions[i];
                const question = assessment.codingQuestions[i];
                
                if (question) {
                    // Simple test case validation (in production, you'd use a code execution service)
                    const testResults = question.testCases.map((testCase, index) => {
                        // This is a simplified version - in reality you'd execute the code
                        const passed = Math.random() > 0.3; // Placeholder logic
                        return {
                            testCase: index,
                            passed,
                            output: passed ? testCase.output : 'Incorrect output',
                            expectedOutput: testCase.output
                        };
                    });

                    const points = testResults.every(r => r.passed) ? question.points : 0;
                    totalScore += points;

                    processedCodingSubmissions.push({
                        questionIndex: i,
                        code: submission.code,
                        language: submission.language || 'javascript',
                        testResults,
                        points
                    });
                }
            }
        }

        const maxScore = (assessment.questions ? assessment.questions.reduce((sum, q) => sum + q.points, 0) : 0) +
                        (assessment.codingQuestions ? assessment.codingQuestions.reduce((sum, q) => sum + q.points, 0) : 0);

        const submission = new Submission({
            assessment: assessmentId,
            student: studentId,
            answers: processedAnswers,
            codingSubmissions: processedCodingSubmissions,
            totalScore,
            maxScore,
            timeTaken,
            completedAt: new Date(),
            status: 'completed'
        });

        await submission.save();
        res.json({ 
            message: 'Assessment submitted successfully',
            score: totalScore,
            maxScore
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin routes

// Create new assessment
router.post('/admin/assessments', checkAdmin, async (req, res) => {
    try {
        const { title, description, type, questions, codingQuestions, timeLimit } = req.body;
        
        const assessment = new Assessment({
            title,
            description,
            type,
            questions: questions || [],
            codingQuestions: codingQuestions || [],
            timeLimit,
            createdBy: req.session.user.id
        });

        await assessment.save();
        res.json({ message: 'Assessment created successfully', assessment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all assessments (for admin)
router.get('/admin/assessments', checkAdmin, async (req, res) => {
    try {
        const assessments = await Assessment.find()
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });
        res.json(assessments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update assessment
router.put('/admin/assessments/:id', checkAdmin, async (req, res) => {
    try {
        const { title, description, type, questions, codingQuestions, timeLimit, isActive } = req.body;
        
        const assessment = await Assessment.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                type,
                questions,
                codingQuestions,
                timeLimit,
                isActive
            },
            { new: true }
        );

        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }

        res.json({ message: 'Assessment updated successfully', assessment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete assessment
router.delete('/admin/assessments/:id', checkAdmin, async (req, res) => {
    try {
        const assessment = await Assessment.findByIdAndDelete(req.params.id);
        
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }

        res.json({ message: 'Assessment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get submission reports
router.get('/admin/submissions', checkAdmin, async (req, res) => {
    try {
        const submissions = await Submission.find()
            .populate('assessment', 'title')
            .populate('student', 'username')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get assessment statistics
router.get('/admin/assessments/:id/stats', checkAdmin, async (req, res) => {
    try {
        const submissions = await Submission.find({ assessment: req.params.id })
            .populate('student', 'username');

        const stats = {
            totalSubmissions: submissions.length,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
            completionRate: 0
        };

        if (submissions.length > 0) {
            const scores = submissions.map(s => s.totalScore);
            stats.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            stats.highestScore = Math.max(...scores);
            stats.lowestScore = Math.min(...scores);
            stats.completionRate = (submissions.filter(s => s.status === 'completed').length / submissions.length) * 100;
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 
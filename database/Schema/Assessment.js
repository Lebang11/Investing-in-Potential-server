const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'passed', 'failed'],
        default: 'pending'
    },
    aptitudeAnswers: {
        type: [{
            questionId: Number,
            answer: Number,
            correct: Boolean
        }],
        required: true
    },
    eqAnswers: {
        type: [{
            questionId: Number,
            answer: Number,
            score: Number
        }],
        required: true
    },
    aptitudeScore: {
        type: Number,
        default: 0
    },
    eqScore: {
        type: Number,
        default: 0
    },
    startTime: {
        type: Date,
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    },
    timeSpent: {
        aptitude: Number,
        eq: Number
    },
    tabSwitches: {
        type: Number,
        default: 0
    }
});

AssessmentSchema.index({ email: 1 });

const Assessment = mongoose.model('assessments', AssessmentSchema);
module.exports = Assessment;
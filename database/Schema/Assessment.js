const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'expired'],
        default: 'pending'
    },
    timeLimit: {
        aptitude: {
            type: Number,
            default: 2400 // 40 minutes in seconds
        },
        eq: {
            type: Number,
            default: 900 // 15 minutes in seconds
        }
    },
    startTime: {
        aptitude: Date,
        eq: Date
    },
    completionTime: {
        aptitude: Date,
        eq: Date
    },
    scores: {
        aptitude: {
            type: Number,
            min: 0,
            max: 100
        },
        eq: {
            type: Number,
            min: 0,
            max: 100
        }
    },
    answers: {
        aptitude: [{
            questionId: String,
            answer: String,
            correct: Boolean
        }],
        eq: [{
            questionId: String,
            answer: String,
            score: Number
        }]
    },
    tabSwitches: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
AssessmentSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Add indexes for faster queries
AssessmentSchema.index({ userId: 1 });
AssessmentSchema.index({ email: 1 });
AssessmentSchema.index({ status: 1 });
AssessmentSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Assessment', AssessmentSchema);
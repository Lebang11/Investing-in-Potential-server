const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    aptitudeAnswers: {
        type: Object,
        required: true
    },
    eqAnswers: {
        type: Object,
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

module.exports = mongoose.model('Assessment', AssessmentSchema);
module.exports = mongoose.model('Assessment', AssessmentSchema);
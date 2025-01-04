const mongoose = require('mongoose');
const crypto = require('crypto');

const PaymentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    planType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'COMPLETE', 'FAILED', 'CANCELLED'],
        default: 'pending'
    },
    paymentDetails: {
        type: Object
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    reference: {
        type: String,
        unique: true,
        default: () => crypto.randomBytes(16).toString('hex')
    }
});

// Add index for faster queries
PaymentSchema.index({ email: 1, status: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);
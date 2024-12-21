const mongoose = require('mongoose');

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
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);
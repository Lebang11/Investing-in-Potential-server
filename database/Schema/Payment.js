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
        paymentId: String,
        paymentDate: String,
        amountPaid: Number,
        isPaid: Boolean
    },
    paidAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
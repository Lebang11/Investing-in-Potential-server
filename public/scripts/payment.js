const express = require('express');
const router = express.Router();
const md5 = require('md5');
require('dotenv').config();
const Payment = require('../../database/Schema/Payment');
const crypto = require('crypto');

// Add body-parser middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// PayFast configuration
const PAYFAST_CONFIG = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    return_url: `${process.env.FRONTEND_URL}/test-rules`,
    cancel_url: `${process.env.FRONTEND_URL}/course-signup`,
    notify_url: `${process.env.BACKEND_URL}/payment/notify`,
};

// Initialize payment
router.post('/initialize', async (req, res) => {
    try {
        console.log('Payment initialization request body:', req.body); // Add logging
        const { email, name, amount, planType } = req.body;

        if (!email || !name || !amount || !planType) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                received: req.body 
            });
        }

        // Generate unique reference
        const reference = crypto.randomBytes(16).toString('hex');

        // Create payment record in database
        const payment = await Payment.create({
            email,
            amount,
            planType,
            status: 'pending',
            reference
        });

        // Generate PayFast data
        const paymentData = {
            merchant_id: PAYFAST_CONFIG.merchant_id,
            merchant_key: PAYFAST_CONFIG.merchant_key,
            return_url: PAYFAST_CONFIG.return_url,
            cancel_url: PAYFAST_CONFIG.cancel_url,
            notify_url: PAYFAST_CONFIG.notify_url,
            name_first: name,
            email_address: email,
            amount: amount.toFixed(2),
            item_name: 'Assessment Fee',
            custom_str1: reference // Use our generated reference
        };

        // Generate signature
        const signatureString = Object.entries(paymentData)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, value]) => `${key}=${encodeURIComponent(String(value).trim())}`)
            .join('&');
        
        paymentData.signature = md5(signatureString);

        res.json(paymentData);
    } catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500).json({ error: 'Failed to initialize payment' });
    }
});

// Payment notification webhook
router.post('/notify', async (req, res) => {
    try {
        const { 
            custom_str1, // This is our reference
            payment_status,
            pf_payment_id,
            payment_date,
            amount_gross 
        } = req.body;

        // Find payment by our reference
        const payment = await Payment.findOne({ reference: custom_str1 });
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // Map PayFast status to our schema status
        let normalizedStatus;
        switch(payment_status.toUpperCase()) {
            case 'COMPLETE':
            case 'COMPLETED':
                normalizedStatus = 'COMPLETE';
                break;
            case 'FAILED':
            case 'FAILURE':
                normalizedStatus = 'FAILED';
                break;
            case 'CANCELLED':
            case 'CANCEL':
                normalizedStatus = 'CANCELLED';
                break;
            default:
                normalizedStatus = 'pending';
        }

        // Update payment
        payment.status = normalizedStatus;
        payment.paymentDetails = {
            paymentId: pf_payment_id,
            paymentDate: payment_date,
            amountPaid: amount_gross,
            isPaid: normalizedStatus === 'COMPLETE'
        };
        if (normalizedStatus === 'COMPLETE') {
            payment.completedAt = new Date();
        }

        await payment.save();
        res.status(200).end();
    } catch (error) {
        console.error('Payment notification error:', error);
        res.status(500).end();
    }
});

module.exports = router;
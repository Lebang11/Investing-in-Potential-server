const express = require('express');
const router = express.Router();
const md5 = require('md5');
require('dotenv').config();

const Payment = require('../../database/Schema/Payment');

const bodyParser = require('body-parser');
router.use(bodyParser.json());


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
        const { email, name, amount, planType } = req.body;

        if (!email || !name || !amount || !planType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create payment record in database
        const payment = await Payment.create({
            email,
            amount,
            planType,
            status: 'pending'
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
            amount: amount.toFixed(2), // PayFast requires amount with 2 decimal places
            item_name: 'Assessment Fee',
            custom_str1: payment._id.toString()
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
// // Initialize payment
// router.post('/initialize', async (req, res) => {
//     try {
//         console.log(req.body)
//         const { email, name, amount, planType } = req.body;

//         // Create payment record in database
//         const payment = await Payment.create({
//             email,
//             amount,
//             planType,
//             status: 'pending'
//         });

//         // Generate PayFast data
//         const paymentData = {
//             ...PAYFAST_CONFIG,
//             name_first: name,
//             email_address: email,
//             amount: amount,
//             item_name: 'Assessment Fee',
//             custom_str1: payment._id // Store our payment ID for reference
//         };

//         // Generate signature
//         const signatureString = Object.entries(paymentData)
//     .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
//     .map(([key, value]) => `${key}=${encodeURIComponent(String(value).trim())}`)
//     .join('&');
        
//         paymentData.signature = md5(signatureString);

//         res.json(paymentData);
//     } catch (error) {
//         console.error('Payment initialization error:', error);
//         res.status(500).json({ error: 'Failed to initialize payment' });
//     }
// });

// Payment notification webhook
router.post('/notify', async (req, res) => {
    try {
        const { custom_str1, payment_status, ...paymentDetails } = req.body;

        // Verify payment signature
        const signature = req.body.signature;
        delete req.body.signature;
        
        const signatureString = Object.entries(req.body)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, value]) => `${key}=${encodeURIComponent(value.trim())}`)
            .join('&');
        
        const calculatedSignature = md5(signatureString);

        if (signature !== calculatedSignature) {
            throw new Error('Invalid signature');
        }

        // Update payment status in database
        await Payment.findByIdAndUpdate(custom_str1, {
            status: payment_status,
            paymentDetails
        });

        // If payment successful, create assessment session
        if (payment_status === 'COMPLETE') {
            await Assessment.create({
                userId: custom_str1,
                status: 'pending',
                timeLimit: {
                    aptitude: 2400, // 40 minutes
                    eq: 900 // 15 minutes
                }
            });
        }

        res.status(200).end();
    } catch (error) {
        console.error('Payment notification error:', error);
        res.status(500).end();
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Payment = require('../../database/Schema/Payment');
const User = require('../../database/Schema/User');
const Assessment = require('../../database/Schema/Assessment');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.admin) {
        return res.status(403).json({ error: 'Unauthorized access' });
    }
    next();
};

// Get all payments
router.get('/payments', isAdmin, async (req, res) => {
    try {
        const payments = await Payment.find()
            .sort({ createdAt: -1 }) // Most recent first
            .populate('userId', 'email name'); // Get user details
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

// Update payment status
router.patch('/payments/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // Update payment status
        payment.status = status;
        if (status === 'COMPLETE') {
            payment.completedAt = new Date();
            
            // Update user payment status
            await User.findByIdAndUpdate(payment.userId, {
                hasPaid: true,
                paidAt: new Date()
            });

            // Create assessment session if it doesn't exist
            const existingAssessment = await Assessment.findOne({ userId: payment.userId });
            if (!existingAssessment) {
                await Assessment.create({
                    userId: payment.userId,
                    status: 'pending',
                    timeLimit: {
                        aptitude: 2400, // 40 minutes
                        eq: 900 // 15 minutes
                    }
                });
            }
        }

        await payment.save();
        res.json(payment);
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ error: 'Failed to update payment' });
    }
});

// Get all users with their payment and assessment status
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password') // Exclude password
            .sort({ createdAt: -1 });

        // Get payment and assessment status for each user
        const usersWithDetails = await Promise.all(users.map(async (user) => {
            const payment = await Payment.findOne({ userId: user._id });
            const assessment = await Assessment.findOne({ userId: user._id });

            return {
                ...user.toObject(),
                paymentStatus: payment ? payment.status : 'no payment',
                assessmentStatus: assessment ? assessment.status : 'not started',
                assessmentScores: assessment ? {
                    aptitude: assessment.aptitudeScore,
                    eq: assessment.eqScore
                } : null
            };
        }));

        res.json(usersWithDetails);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get all assessments
router.get('/assessments', isAdmin, async (req, res) => {
    try {
        const assessments = await Assessment.find()
            .populate('userId', 'email name')
            .sort({ createdAt: -1 });
        res.json(assessments);
    } catch (error) {
        console.error('Error fetching assessments:', error);
        res.status(500).json({ error: 'Failed to fetch assessments' });
    }
});

// Get dashboard statistics
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const [
            totalUsers,
            totalPayments,
            completedPayments,
            completedAssessments
        ] = await Promise.all([
            User.countDocuments(),
            Payment.countDocuments(),
            Payment.countDocuments({ status: 'COMPLETE' }),
            Assessment.countDocuments({ status: 'completed' })
        ]);

        // Calculate revenue
        const revenue = await Payment.aggregate([
            { $match: { status: 'COMPLETE' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            totalUsers,
            totalPayments,
            completedPayments,
            completedAssessments,
            revenue: revenue[0]?.total || 0
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

module.exports = router;
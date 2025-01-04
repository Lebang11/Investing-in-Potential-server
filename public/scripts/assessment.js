const express = require('express');
const router = express.Router();
const Assessment = require('../../database/Schema/Assessment');

router.use(express.json());

// Submit assessment
router.post('/submit', async (req, res) => {
    try {
        const { 
            email, 
            aptitudeAnswers, 
            eqAnswers, 
            timeSpent,
            tabSwitches 
        } = req.body;

        if (!email || !aptitudeAnswers || !eqAnswers) {
            return res.status(400).json({ 
                error: 'Missing required fields' 
            });
        }

        // Create assessment record
        const assessment = await Assessment.create({
            email,
            aptitudeAnswers,
            eqAnswers,
            timeSpent,
            tabSwitches
        });

        res.status(201).json({
            message: 'Assessment submitted successfully',
            assessmentId: assessment._id
        });

    } catch (error) {
        console.error('Assessment submission error:', error);
        res.status(500).json({ 
            error: 'Failed to submit assessment' 
        });
    }
});

// Get assessment results
router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const assessment = await Assessment.findOne({ email }).sort({ completedAt: -1 });
        
        if (!assessment) {
            return res.status(404).json({ 
                error: 'Assessment not found' 
            });
        }

        res.json(assessment);
    } catch (error) {
        console.error('Error fetching assessment:', error);
        res.status(500).json({ 
            error: 'Failed to fetch assessment results' 
        });
    }
});

// Add new route to check assessment status
router.get('/status/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const assessment = await Assessment.findOne({ email })
            .sort({ completedAt: -1 });
        
        if (!assessment) {
            return res.json({ exists: false });
        }

        res.json({
            exists: true,
            status: assessment.status,
            completedAt: assessment.completedAt
        });
    } catch (error) {
        console.error('Error checking assessment status:', error);
        res.status(500).json({ error: 'Failed to check assessment status' });
    }
});

// Get all assessments (admin only)
router.get('/all', async (req, res) => {
    try {
        const assessments = await Assessment.find()
            .sort({ completedAt: -1 });
        
        res.json(assessments);
    } catch (error) {
        console.error('Error fetching assessments:', error);
        res.status(500).json({ error: 'Failed to fetch assessments' });
    }
});

// Update assessment status (admin only)
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const assessment = await Assessment.findByIdAndUpdate(
            id,
            { 
                status,
                reviewedAt: new Date()
            },
            { new: true }
        );

        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }

        res.json(assessment);
    } catch (error) {
        console.error('Error updating assessment:', error);
        res.status(500).json({ error: 'Failed to update assessment' });
    }
});

module.exports = router; 
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

module.exports = router; 
const express = require('express');
const router = express.Router();
const Assessment = require('../../database/Schema/Assessment');
const { aptitudeQuestions, eqQuestions } = require('../../data/assessmentQuestions');

router.use(express.json());

// Submit assessment
router.post('/submit', async (req, res) => {
    try {
        const { 
            email, 
            aptitudeAnswers, 
            eqAnswers, 
            timeSpent,
            tabSwitches,
            startTime 
        } = req.body;

        if (!email || !aptitudeAnswers || !eqAnswers) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure startTime is a valid date
        const parsedStartTime = new Date(startTime);
        if (isNaN(parsedStartTime.getTime())) {
            return res.status(400).json({ error: 'Invalid start time' });
        }

        // Format aptitude answers and calculate score
        const formattedAptitudeAnswers = Object.entries(aptitudeAnswers)
            .filter(([key]) => key.startsWith('aptitude_'))
            .map(([key, answer]) => {
                const questionId = parseInt(key.split('_')[1]);
                const question = aptitudeQuestions[questionId];
                const parsedAnswer = parseInt(answer);
                
                return {
                    questionId,
                    answer: parsedAnswer,
                    correct: parsedAnswer === question.correct
                };
            });

        const aptitudeScore = (formattedAptitudeAnswers.filter(a => a.correct).length / aptitudeQuestions.length) * 100;

        // Format EQ answers and calculate score
        const formattedEqAnswers = Object.entries(eqAnswers)
            .filter(([key]) => key.startsWith('eq_'))
            .map(([key, answer]) => {
                const questionId = parseInt(key.split('_')[1]);
                const parsedAnswer = parseInt(answer);
                
                return {
                    questionId,
                    answer: parsedAnswer,
                    score: calculateEQScore(parsedAnswer)
                };
            });

        const eqScore = formattedEqAnswers.reduce((acc, curr) => acc + curr.score, 0) / formattedEqAnswers.length;

        // Create assessment record
        const assessment = await Assessment.create({
            email,
            aptitudeAnswers: formattedAptitudeAnswers,
            eqAnswers: formattedEqAnswers,
            aptitudeScore,
            eqScore,
            timeSpent,
            tabSwitches,
            startTime: parsedStartTime
        });

        res.status(201).json({
            message: 'Assessment submitted successfully',
            assessmentId: assessment._id
        });

    } catch (error) {
        console.error('Assessment submission error:', error);
        res.status(500).json({ error: 'Failed to submit assessment' });
    }
});

// Helper function to calculate EQ score
function calculateEQScore(answer) {
    // Convert 0-4 to 1-5 score
    return answer + 1;
}

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
// router.get('/all', async (req, res) => {
//     try {
//         const assessments = await Assessment.find({});
        
//         console.log('Fetched assessments:', assessments); // Add logging
//         res.json(assessments);
//     } catch (error) {
//         console.error('Error fetching assessments:', error);
//         res.status(500).json({ error: 'Failed to fetch assessments' });
//     }
// });

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

// Get detailed assessment view
router.get('/:id/details', async (req, res) => {
    try {
        const { id } = req.params;
        const assessment = await Assessment.findById(id);
        
        if (!assessment) {
            return res.status(404).json({ error: 'Assessment not found' });
        }

        // Add questions to the response
        const detailedAssessment = {
            ...assessment.toObject(),
            aptitudeQuestions: assessment.aptitudeAnswers.map(answer => ({
                ...answer,
                question: aptitudeQuestions[answer.questionId]
            })),
            eqQuestions: assessment.eqAnswers.map(answer => ({
                ...answer,
                question: eqQuestions[answer.questionId]
            }))
        };

        res.json(detailedAssessment);
    } catch (error) {
        console.error('Error fetching assessment details:', error);
        res.status(500).json({ error: 'Failed to fetch assessment details' });
    }
});

module.exports = router; 
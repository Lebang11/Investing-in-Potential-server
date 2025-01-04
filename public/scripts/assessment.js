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
            return res.status(400).json({ 
                error: 'Missing required fields' 
            });
        }

        // Ensure startTime is a valid date
        const parsedStartTime = new Date(startTime);
        if (isNaN(parsedStartTime.getTime())) {
            return res.status(400).json({
                error: 'Invalid start time'
            });
        }

        // Calculate aptitude score
        const formattedAptitudeAnswers = Object.entries(aptitudeAnswers)
            .filter(([key]) => key.startsWith('aptitude_'))
            .map(([key, answer]) => {
                const questionId = parseInt(key.split('_')[1]);
                // Make sure questionId is within bounds
                if (questionId >= 0 && questionId < aptitudeQuestions.length) {
                    const question = aptitudeQuestions[questionId];
                    return {
                        questionId,
                        answer,
                        correct: answer === question.correct
                    };
                }
                return null;
            }).filter(Boolean); // Remove any null entries

        const aptitudeScore = (formattedAptitudeAnswers.filter(a => a.correct).length / aptitudeQuestions.length) * 100;

        // Calculate EQ score
        const formattedEqAnswers = Object.entries(eqAnswers)
            .filter(([key]) => key.startsWith('eq_'))
            .map(([key, answer]) => {
                const questionId = parseInt(key.split('_')[1]);
                // Make sure questionId is within bounds
                if (questionId >= 0 && questionId < eqQuestions.length) {
                    return {
                        questionId,
                        answer,
                        score: calculateEQScore(answer, questionId)
                    };
                }
                return null;
            }).filter(Boolean); // Remove any null entries

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
        res.status(500).json({ 
            error: 'Failed to submit assessment' 
        });
    }
});

// Helper function to calculate EQ score for each answer
function calculateEQScore(answer, questionId) {
    const question = eqQuestions[questionId];
    // Implement your EQ scoring logic here
    // For example:
    const scoreMap = {
        0: 1,  // Strongly disagree
        1: 2,  // Disagree
        2: 3,  // Neutral
        3: 4,  // Agree
        4: 5   // Strongly agree
    };
    return scoreMap[answer] || 3; // Default to neutral if invalid answer
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
                question: answer.questionId < aptitudeQuestions.length ? 
                    aptitudeQuestions[answer.questionId] : 
                    { question: 'Question not found', options: [] }
            })),
            eqQuestions: assessment.eqAnswers.map(answer => ({
                ...answer,
                question: answer.questionId < eqQuestions.length ? 
                    eqQuestions[answer.questionId] : 
                    { question: 'Question not found', options: [] }
            }))
        };

        res.json(detailedAssessment);
    } catch (error) {
        console.error('Error fetching assessment details:', error);
        res.status(500).json({ error: 'Failed to fetch assessment details' });
    }
});

module.exports = router; 
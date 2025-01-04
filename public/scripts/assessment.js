const express = require('express');
const router = express.Router();
const Assessment = require('../../database/Schema/Assessment');
const { aptitudeQuestions, eqQuestions } = require('../../data/assessmentQuestions');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GOOGLE_APP_PASSWORD
    }
});

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

// Update assessment status
router.put('/status/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const assessment = await Assessment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )

        if (status === 'passed') {
            // Send congratulatory email
            const emailContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">Congratulations! 🎉</h2>
                    
                    <p>We're excited to inform you that you've successfully passed our assessment process and have been accepted into our program!</p>
                    
                    <h3 style="color: #2c3e50;">Next Steps:</h3>
                    <ol>
                        <li>Complete your enrollment by visiting our <a href="${process.env.FRONTEND_URL}/onboarding">onboarding page</a></li>
                        <li>Review your selected plan: ${assessment.paymentPlan ? assessment.paymentPlan.name : 'Your chosen plan'}</li>
                        <li>Prepare for your journey - the next cohort starts on February 5th, 2024</li>
                    </ol>

                    <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <h4 style="color: #2c3e50; margin-top: 0;">Program Highlights:</h4>
                        <ul>
                            <li>Comprehensive Full-Stack Development curriculum</li>
                            <li>Industry-relevant projects and assignments</li>
                            <li>One-on-one mentorship sessions</li>
                            <li>Career guidance and placement support</li>
                        </ul>
                    </div>

                    <p><strong>Important:</strong> Please complete your enrollment within the next 7 days to secure your spot in the upcoming cohort.</p>

                    <a href="${process.env.FRONTEND_URL}/onboarding" style="display: inline-block; background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Complete Your Enrollment</a>

                    <p>If you have any questions, please don't hesitate to reach out to our support team.</p>

                    <p>Best regards,<br>The Investing in Potential Team</p>
                </div>
            `;

            await transporter.sendMail({
                from: `Investing in Potential <${process.env.EMAIL_USER}>`,
                to: assessment.email,
                subject: 'Congratulations! You\'ve Been Accepted! 🎉',
                html: emailContent
            });
        }

        res.json(assessment);
    } catch (error) {
        console.error('Error updating assessment status:', error);
        res.status(500).json({ error: 'Failed to update assessment status' });
    }
});

module.exports = router; 
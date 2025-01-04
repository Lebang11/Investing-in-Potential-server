const aptitudeQuestions = [
    {
        question: "What comes next in the sequence: 2, 4, 8, 16, __?",
        options: ["24", "32", "30", "28"],
        correct: 1 // 32
    },
    {
        question: "If a shirt costs R80 after a 20% discount, what was the original price?",
        options: ["R96", "R100", "R120", "R90"],
        correct: 0 // R96
    },
    {
        question: "Complete the analogy: Book is to Reading as Fork is to ___",
        options: ["Kitchen", "Eating", "Cooking", "Food"],
        correct: 1 // Eating
    },
    {
        question: "If 3 workers can build a wall in 6 hours, how long will it take 2 workers?",
        options: ["8 hours", "9 hours", "7 hours", "10 hours"],
        correct: 1 // 9 hours
    },
    {
        question: "Which number is missing: 1, 4, 9, 16, 25, __, 49",
        options: ["36", "32", "40", "42"],
        correct: 0 // 36
    },
    {
        question: "If all Blicks are Blocks and some Blocks are Blacks, then:",
        options: [
            "All Blicks are Blacks",
            "Some Blicks might be Blacks",
            "No Blicks are Blacks",
            "All Blacks are Blocks"
        ],
        correct: 1 // Some Blicks might be Blacks
    },
    {
        question: "What is 15% of 200?",
        options: ["30", "20", "25", "35"],
        correct: 0 // 30
    },
    {
        question: "If a car travels 120 km in 2 hours, what is its speed?",
        options: ["60 km/h", "50 km/h", "70 km/h", "80 km/h"],
        correct: 0 // 60 km/h
    },
    {
        question: "Complete the pattern: 16, 8, 24, 12, 36, __",
        options: ["18", "48", "24", "32"],
        correct: 0 // 18
    },
    {
        question: "If 'FRIEND' is coded as 'GSJFOE', how is 'WORLD' coded?",
        options: ["XPSME", "VPSKC", "XPSMF", "XPSME"],
        correct: 0 // XPSME
    },
    {
        question: "What is the next letter in the sequence: A, C, F, J, __?",
        options: ["N", "O", "P", "M"],
        correct: 1 // O
    },
    {
        question: "If 8 machines make 8 items in 8 minutes, how long do 2 machines take to make 2 items?",
        options: ["2 minutes", "8 minutes", "4 minutes", "16 minutes"],
        correct: 1 // 8 minutes
    },
    {
        question: "Which word does NOT belong?",
        options: ["Apple", "Banana", "Carrot", "Orange"],
        correct: 2 // Carrot (it's a vegetable)
    },
    {
        question: "What is the area of a rectangle with length 8m and width 6m?",
        options: ["48m²", "28m²", "14m²", "24m²"],
        correct: 0 // 48m²
    },
    {
        question: "If today is Tuesday, what day will it be in 100 days?",
        options: ["Thursday", "Wednesday", "Tuesday", "Friday"],
        correct: 1 // Wednesday
    }
];

const eqQuestions = [
    {
        question: "I find it easy to understand others' feelings",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I remain calm under pressure",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I can handle criticism well",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I adapt easily to new situations",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I consider how my actions affect others",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I can work effectively in a team",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I communicate my feelings clearly",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I help others feel comfortable around me",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I can resolve conflicts effectively",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I am patient with difficult people",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I take responsibility for my mistakes",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I can motivate others",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I stay positive in challenging situations",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I am open to feedback about my behavior",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        question: "I can read non-verbal cues well",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    }
];

module.exports = {
    aptitudeQuestions,
    eqQuestions
}; 
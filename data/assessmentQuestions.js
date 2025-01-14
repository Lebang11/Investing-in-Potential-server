const questions = {
  aptitude: [
    {
      id: 0,
      question: "What comes next in the sequence: 2, 4, 8, 16, __?",
      options: ["24", "32", "30", "28"],
      correct: 1
    },
    {
      id: 1,
      question: "If a shirt costs R80 after a 20% discount, what was the original price?",
      options: ["R96", "R100", "R120", "R90"],
      correct: 0
    },
    {
      id: 2,
      question: "Complete the analogy: Book is to Reading as Fork is to ___",
      options: ["Kitchen", "Eating", "Cooking", "Food"],
      correct: 1
    },
    {
      id: 3,
      question: "If 3 workers can build a wall in 6 hours, how long will it take 2 workers?",
      options: ["8 hours", "9 hours", "7 hours", "10 hours"],
      correct: 1
    },
    {
      id: 4,
      question: "Which number is missing: 1, 4, 9, 16, 25, __, 49",
      options: ["36", "32", "40", "42"],
      correct: 0
    },
    {
      id: 5,
      question: "If all Blicks are Blocks and some Blocks are Blacks, then:",
      options: [
        "All Blicks are Blacks",
        "Some Blicks might be Blacks",
        "No Blicks are Blacks",
        "All Blacks are Blocks"
      ],
      correct: 1
    },
    {
      id: 6,
      question: "What is 15% of 200?",
      options: ["30", "20", "25", "35"],
      correct: 0
    },
    {
      id: 7,
      question: "If a car travels 120 km in 2 hours, what is its speed?",
      options: ["60 km/h", "50 km/h", "70 km/h", "80 km/h"],
      correct: 0
    },
    {
      id: 8,
      question: "Complete the pattern: 16, 8, 24, 12, 36, __",
      options: ["18", "48", "24", "32"],
      correct: 0
    },
    {
      id: 9,
      question: "If 'FRIEND' is coded as 'GSJFOE', how is 'WORLD' coded?",
      options: ["XPSME", "VPSKC", "XPSMF", "XPSME"],
      correct: 0
    },
    {
      id: 10,
      question: "What is the next letter in the sequence: A, C, F, J, __?",
      options: ["N", "O", "P", "M"],
      correct: 1
    },
    {
      id: 11,
      question: "If 8 machines make 8 items in 8 minutes, how long do 2 machines take to make 2 items?",
      options: ["2 minutes", "8 minutes", "4 minutes", "16 minutes"],
      correct: 1
    },
    {
      id: 12,
      question: "Which word does NOT belong?",
      options: ["Apple", "Banana", "Carrot", "Orange"],
      correct: 2
    },
    {
      id: 13,
      question: "What is the area of a rectangle with length 8m and width 6m?",
      options: ["48m²", "28m²", "14m²", "24m²"],
      correct: 0
    },
    {
      id: 14,
      question: "If today is Tuesday, what day will it be in 100 days?",
      options: ["Thursday", "Wednesday", "Tuesday", "Friday"],
      correct: 1
    }
  ],
  eq: [
    {
      id: 0,
      question: "In a team project, a colleague consistently submits their work late. How would you handle this situation?",
      options: [
        "Report them to the supervisor immediately",
        "Have a private conversation to understand their challenges",
        "Take over their tasks without discussion",
        "Ignore the situation to avoid conflict"
      ]
    },
    {
      id: 1,
      question: "You receive harsh criticism in front of your colleagues. What's your immediate response?",
      options: [
        "Defend yourself aggressively",
        "Listen carefully and request a private discussion",
        "Leave the room immediately",
        "Criticize the person back"
      ]
    },
    {
      id: 2,
      question: "A team member is struggling with personal issues affecting their work. What do you do?",
      options: [
        "Keep your distance to respect their privacy",
        "Offer support while maintaining professional boundaries",
        "Tell them to keep personal issues at home",
        "Take over all their work"
      ]
    },
    {
      id: 3,
      question: "During a heated discussion, someone becomes visibly upset. How do you respond?",
      options: [
        "Continue the discussion to reach a conclusion",
        "Suggest a short break to cool down",
        "Change the subject immediately",
        "Leave them alone to process"
      ]
    },
    {
      id: 4,
      question: "You notice a colleague taking credit for your work. What's your approach?",
      options: [
        "Confront them publicly",
        "Document your contributions and discuss privately",
        "Start taking credit for their work",
        "Say nothing to avoid conflict"
      ]
    },
    {
      id: 5,
      question: "In a group setting, someone shares an idea similar to yours. How do you react?",
      options: [
        "Immediately point out it was your idea first",
        "Build on their point and add your perspective",
        "Stay silent and feel resentful",
        "Dismiss their version of the idea"
      ]
    },
    {
      id: 6,
      question: "A project you led fails to meet its goals. How do you handle it?",
      options: [
        "Blame team members who underperformed",
        "Take responsibility and propose solutions",
        "Make excuses about external factors",
        "Avoid discussing the failure"
      ]
    },
    {
      id: 7,
      question: "You disagree with a new company policy. What's your response?",
      options: [
        "Complain to colleagues",
        "Present constructive feedback through proper channels",
        "Ignore the policy quietly",
        "Threaten to quit"
      ]
    },
    {
      id: 8,
      question: "A colleague is spreading rumors about you. What do you do?",
      options: [
        "Spread rumors about them in return",
        "Address it directly with them and HR if needed",
        "Ignore it completely",
        "Confront them aggressively"
      ]
    },
    {
      id: 9,
      question: "Your team is resistant to a change you're implementing. How do you proceed?",
      options: [
        "Force the change through",
        "Listen to concerns and adjust plans accordingly",
        "Abandon the change entirely",
        "Let each person decide to participate"
      ]
    },
    {
      id: 10,
      question: "You notice a mistake in your work after presentation. What's your action?",
      options: [
        "Hope no one notices",
        "Acknowledge it and propose corrections",
        "Blame it on technical issues",
        "Delete the presentation"
      ]
    },
    {
      id: 11,
      question: "A colleague is visibly stressed about their workload. How do you respond?",
      options: [
        "Tell them to work faster",
        "Offer specific help and support",
        "Avoid them until they feel better",
        "Tell them everyone is stressed"
      ]
    },
    {
      id: 12,
      question: "You receive conflicting requests from two managers. What do you do?",
      options: [
        "Do both tasks poorly",
        "Arrange a meeting to discuss priorities",
        "Choose the senior manager's task",
        "Ignore both requests"
      ]
    },
    {
      id: 13,
      question: "Your idea is criticized in a meeting. How do you handle it?",
      options: [
        "Defend it aggressively",
        "Consider the feedback and adapt",
        "Never share ideas again",
        "Leave the meeting"
      ]
    },
    {
      id: 14,
      question: "A team member constantly interrupts others. What's your approach?",
      options: [
        "Interrupt them back",
        "Privately discuss the impact of their behavior",
        "Stop attending meetings",
        "Complain to others"
      ]
    }
  ]
};

module.exports = {
  aptitudeQuestions: questions.aptitude,
  eqQuestions: questions.eq
}; 
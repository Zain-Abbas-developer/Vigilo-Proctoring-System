// ======================================================
// STUDENT MOCK DATA
// For Dashboard, Exams, Instructions, System Check,
// Face Verification, Exam, Result & Previous Results
// ======================================================


// ======================================================
// 1. STUDENTS
// ======================================================

export const students = [
  {
    id: "STU-001",
    name: "Ali Raza",
    email: "ali.raza@example.com",
    rollNumber: "CS-2026-001",
    department: "Computer Science",
    semester: "6th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-002",
    name: "Ayesha Khan",
    email: "ayesha.khan@example.com",
    rollNumber: "CS-2026-002",
    department: "Computer Science",
    semester: "6th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-003",
    name: "Hamza Ahmed",
    email: "hamza.ahmed@example.com",
    rollNumber: "SE-2026-003",
    department: "Software Engineering",
    semester: "5th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-004",
    name: "Fatima Noor",
    email: "fatima.noor@example.com",
    rollNumber: "CS-2026-004",
    department: "Computer Science",
    semester: "7th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-005",
    name: "Usman Ali",
    email: "usman.ali@example.com",
    rollNumber: "SE-2026-005",
    department: "Software Engineering",
    semester: "6th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-006",
    name: "Hira Malik",
    email: "hira.malik@example.com",
    rollNumber: "IT-2026-006",
    department: "Information Technology",
    semester: "5th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-007",
    name: "Bilal Hassan",
    email: "bilal.hassan@example.com",
    rollNumber: "CS-2026-007",
    department: "Computer Science",
    semester: "6th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-008",
    name: "Zoya Ahmed",
    email: "zoya.ahmed@example.com",
    rollNumber: "SE-2026-008",
    department: "Software Engineering",
    semester: "7th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-009",
    name: "Saad Khan",
    email: "saad.khan@example.com",
    rollNumber: "CS-2026-009",
    department: "Computer Science",
    semester: "5th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-010",
    name: "Maryam Iqbal",
    email: "maryam.iqbal@example.com",
    rollNumber: "IT-2026-010",
    department: "Information Technology",
    semester: "6th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-011",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    rollNumber: "CS-2026-011",
    department: "Computer Science",
    semester: "7th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-012",
    name: "Sana Tariq",
    email: "sana.tariq@example.com",
    rollNumber: "SE-2026-012",
    department: "Software Engineering",
    semester: "6th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-013",
    name: "Danish Aslam",
    email: "danish.aslam@example.com",
    rollNumber: "IT-2026-013",
    department: "Information Technology",
    semester: "5th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-014",
    name: "Iqra Shah",
    email: "iqra.shah@example.com",
    rollNumber: "CS-2026-014",
    department: "Computer Science",
    semester: "6th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-015",
    name: "Talha Mahmood",
    email: "talha.mahmood@example.com",
    rollNumber: "SE-2026-015",
    department: "Software Engineering",
    semester: "7th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-016",
    name: "Laiba Noor",
    email: "laiba.noor@example.com",
    rollNumber: "CS-2026-016",
    department: "Computer Science",
    semester: "5th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-017",
    name: "Owais Ahmed",
    email: "owais.ahmed@example.com",
    rollNumber: "IT-2026-017",
    department: "Information Technology",
    semester: "6th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-018",
    name: "Maham Fatima",
    email: "maham.fatima@example.com",
    rollNumber: "CS-2026-018",
    department: "Computer Science",
    semester: "7th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-019",
    name: "Rayan Ali",
    email: "rayan.ali@example.com",
    rollNumber: "SE-2026-019",
    department: "Software Engineering",
    semester: "6th",
    avatar: null,
    status: "active",
  },
  {
    id: "STU-020",
    name: "Anaya Sheikh",
    email: "anaya.sheikh@example.com",
    rollNumber: "IT-2026-020",
    department: "Information Technology",
    semester: "5th",
    avatar: null,
    status: "active",
  },
];


// ======================================================
// 2. EXAMS
// ======================================================

export const exams = [
  {
    id: "EXM-001",
    title: "Mathematics Midterm",
    subject: "Mathematics",
    description: "Covers algebra, calculus and mathematical reasoning.",
    questions: 30,
    duration: 60,
    totalMarks: 100,
    passingMarks: 40,
    date: "Sep 05, 2026",
    time: "10:00 AM",
    status: "available",
    attemptNumber: 1,
    attemptsAllowed: 2,
    score: null,
  },

  {
    id: 2 || "EXM-002",
    title: "Physics Assessment",
    subject: "Physics",
    description: "Assessment covering mechanics, motion and energy.",
    questions: 25,
    duration: 45,
    totalMarks: 100,
    passingMarks: 40,
    date: "Sep 07, 2026",
    time: "02:00 PM",
    status: "upcoming",
    attemptNumber: 0,
    attemptsAllowed: 1,
    score: null,
  },

  {
    id: 3 || "EXM-003",
    title: "Computer Science Quiz",
    subject: "Computer Science",
    description: "Test your knowledge of programming and data structures.",
    questions: 20,
    duration: 30,
    totalMarks: 100,
    passingMarks: 40,
    date: "Sep 07, 2026",
    time: "02:00 PM",
    status: "upcoming",
    attemptNumber: 0,
    attemptsAllowed: 1,
    score: null,
  },

  {
    id: 4 || "EXM-004",
    title: "Data Structures & Algorithms",
    subject: "Computer Science",
    description: "Covers linked lists, trees, sorting and searching algorithms.",
    questions: 35,
    duration: 75,
    totalMarks: 100,
    passingMarks: 40,
    date: "Sep 12, 2026",
    time: "10:00 AM",
    status: "upcoming",
    attemptNumber: 0,
    attemptsAllowed: 1,
    score: null,
  },

  {
    id: 5 || "EXM-005",
    title: "English Language Proficiency",
    subject: "English",
    description: "Assessment of reading, writing, listening and speaking skills.",
    questions: 40,
    duration: 75,
    totalMarks: 100,
    passingMarks: 40,
    date: "Sep 18, 2026",
    time: "10:00 AM",
    status: "available",
    attemptNumber: 0,
    attemptsAllowed: 1,
    score: null,
  },
];

// ===============================
// Exam title testin
// ===============================
export const exam = {
  userId: "STU001",
  examId: "EXAM001",
  title: "Mathematics Midterm",
  examType: "Midterm",
  duration: 45, // minutes
};


// ======================================================
// 3. EXAM QUESTIONS
// ======================================================

export const examQuestions = {
  "EXM-001": [
    {
      id: 1,
      question: "Which keyword is used to declare a constant?",
      options: ["var", "let", "const", "static"],
      correctAnswer: "const",
      marks: 1,
    },
    {
      id: 2,
      question: "Which method adds an item to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctAnswer: "push()",
      marks: 1,
    },
    {
      id: 3,
      question: "Which operator checks strict equality?",
      options: ["=", "==", "===", "!="],
      correctAnswer: "===",
      marks: 1,
    },
    {
      id: 4,
      question: "Which method converts JSON into a JavaScript object?",
      options: [
        "JSON.parse()",
        "JSON.stringify()",
        "JSON.convert()",
        "JSON.object()",
      ],
      correctAnswer: "JSON.parse()",
      marks: 1,
    },
    {
      id: 5,
      question: "What does typeof null return?",
      options: ["null", "object", "undefined", "boolean"],
      correctAnswer: "object",
      marks: 1,
    },
  ],

  "EXM-002": [
    {
      id: 1,
      question: "Which hook manages state in React?",
      options: ["useEffect", "useState", "useMemo", "useRef"],
      correctAnswer: "useState",
      marks: 1,
    },
    {
      id: 2,
      question: "How does a parent pass data to a child?",
      options: ["State", "Props", "Reducer", "Router"],
      correctAnswer: "Props",
      marks: 1,
    },
    {
      id: 3,
      question: "Which hook handles side effects?",
      options: ["useState", "useEffect", "useMemo", "useRef"],
      correctAnswer: "useEffect",
      marks: 1,
    },
  ],

  "EXM-003": [
    {
      id: 1,
      question: "Which SQL command is used to retrieve data?",
      options: ["GET", "SELECT", "FETCH", "READ"],
      correctAnswer: "SELECT",
      marks: 1,
    },
    {
      id: 2,
      question: "Which SQL clause filters records?",
      options: ["WHERE", "FILTER", "HAVING", "SEARCH"],
      correctAnswer: "WHERE",
      marks: 1,
    },
  ],
};


// ======================================================
// 4. EXAM ATTEMPTS - 20 STUDENTS
// ======================================================

export const examAttempts = [
  {
    id: "ATT-001",
    studentId: "STU-001",
    examId: "EXM-001",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 30,
    obtainedMarks: 25,
    percentage: 83.33,
    totalQuestions: 30,
    attemptedQuestions: 28,
    correctAnswers: 25,
    wrongAnswers: 3,
    skippedQuestions: 2,
    timeTaken: 52,
    violations: 1,
    startedAt: "2026-09-03T11:00:00",
    submittedAt: "2026-09-03T11:52:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-002",
    studentId: "STU-002",
    examId: "EXM-001",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 30,
    obtainedMarks: 27,
    percentage: 90,
    totalQuestions: 30,
    attemptedQuestions: 30,
    correctAnswers: 27,
    wrongAnswers: 3,
    skippedQuestions: 0,
    timeTaken: 48,
    violations: 0,
    startedAt: "2026-09-03T10:00:00",
    submittedAt: "2026-09-03T10:48:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-003",
    studentId: "STU-003",
    examId: "EXM-003",
    attemptNumber: 1,
    status: "completed",
    result: "failed",
    totalMarks: 25,
    obtainedMarks: 12,
    percentage: 48,
    totalQuestions: 25,
    attemptedQuestions: 22,
    correctAnswers: 12,
    wrongAnswers: 10,
    skippedQuestions: 3,
    timeTaken: 42,
    violations: 2,
    startedAt: "2026-09-02T12:00:00",
    submittedAt: "2026-09-02T12:42:00",
    proctoringStatus: "reviewed",
  },

  {
    id: "ATT-004",
    studentId: "STU-004",
    examId: "EXM-002",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 40,
    obtainedMarks: 35,
    percentage: 87.5,
    totalQuestions: 40,
    attemptedQuestions: 39,
    correctAnswers: 35,
    wrongAnswers: 4,
    skippedQuestions: 1,
    timeTaken: 72,
    violations: 0,
    startedAt: "2026-09-03T09:00:00",
    submittedAt: "2026-09-03T10:12:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-005",
    studentId: "STU-005",
    examId: "EXM-003",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 25,
    obtainedMarks: 21,
    percentage: 84,
    totalQuestions: 25,
    attemptedQuestions: 24,
    correctAnswers: 21,
    wrongAnswers: 3,
    skippedQuestions: 1,
    timeTaken: 39,
    violations: 0,
    startedAt: "2026-09-02T13:00:00",
    submittedAt: "2026-09-02T13:39:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-006",
    studentId: "STU-006",
    examId: "EXM-001",
    attemptNumber: 1,
    status: "completed",
    result: "failed",
    totalMarks: 30,
    obtainedMarks: 15,
    percentage: 50,
    totalQuestions: 30,
    attemptedQuestions: 26,
    correctAnswers: 15,
    wrongAnswers: 11,
    skippedQuestions: 4,
    timeTaken: 59,
    violations: 3,
    startedAt: "2026-09-03T14:00:00",
    submittedAt: "2026-09-03T14:59:00",
    proctoringStatus: "reviewed",
  },

  {
    id: "ATT-007",
    studentId: "STU-007",
    examId: "EXM-002",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 40,
    obtainedMarks: 32,
    percentage: 80,
    totalQuestions: 40,
    attemptedQuestions: 36,
    correctAnswers: 32,
    wrongAnswers: 4,
    skippedQuestions: 4,
    timeTaken: 81,
    violations: 1,
    startedAt: "2026-09-03T15:00:00",
    submittedAt: "2026-09-03T16:21:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-008",
    studentId: "STU-008",
    examId: "EXM-001",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 30,
    obtainedMarks: 28,
    percentage: 93.33,
    totalQuestions: 30,
    attemptedQuestions: 30,
    correctAnswers: 28,
    wrongAnswers: 2,
    skippedQuestions: 0,
    timeTaken: 45,
    violations: 0,
    startedAt: "2026-09-04T09:00:00",
    submittedAt: "2026-09-04T09:45:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-009",
    studentId: "STU-009",
    examId: "EXM-003",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 25,
    obtainedMarks: 19,
    percentage: 76,
    totalQuestions: 25,
    attemptedQuestions: 23,
    correctAnswers: 19,
    wrongAnswers: 4,
    skippedQuestions: 2,
    timeTaken: 41,
    violations: 0,
    startedAt: "2026-09-04T10:00:00",
    submittedAt: "2026-09-04T10:41:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-010",
    studentId: "STU-010",
    examId: "EXM-002",
    attemptNumber: 1,
    status: "completed",
    result: "failed",
    totalMarks: 40,
    obtainedMarks: 20,
    percentage: 50,
    totalQuestions: 40,
    attemptedQuestions: 30,
    correctAnswers: 20,
    wrongAnswers: 10,
    skippedQuestions: 10,
    timeTaken: 89,
    violations: 4,
    startedAt: "2026-09-04T11:00:00",
    submittedAt: "2026-09-04T12:29:00",
    proctoringStatus: "reviewed",
  },

  {
    id: "ATT-011",
    studentId: "STU-011",
    examId: "EXM-001",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 30,
    obtainedMarks: 24,
    percentage: 80,
    totalQuestions: 30,
    attemptedQuestions: 27,
    correctAnswers: 24,
    wrongAnswers: 3,
    skippedQuestions: 3,
    timeTaken: 51,
    violations: 1,
    startedAt: "2026-09-04T13:00:00",
    submittedAt: "2026-09-04T13:51:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-012",
    studentId: "STU-012",
    examId: "EXM-003",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 25,
    obtainedMarks: 23,
    percentage: 92,
    totalQuestions: 25,
    attemptedQuestions: 25,
    correctAnswers: 23,
    wrongAnswers: 2,
    skippedQuestions: 0,
    timeTaken: 36,
    violations: 0,
    startedAt: "2026-09-04T14:00:00",
    submittedAt: "2026-09-04T14:36:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-013",
    studentId: "STU-013",
    examId: "EXM-002",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 40,
    obtainedMarks: 30,
    percentage: 75,
    totalQuestions: 40,
    attemptedQuestions: 35,
    correctAnswers: 30,
    wrongAnswers: 5,
    skippedQuestions: 5,
    timeTaken: 84,
    violations: 1,
    startedAt: "2026-09-04T15:00:00",
    submittedAt: "2026-09-04T16:24:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-014",
    studentId: "STU-014",
    examId: "EXM-001",
    attemptNumber: 1,
    status: "completed",
    result: "failed",
    totalMarks: 30,
    obtainedMarks: 14,
    percentage: 46.67,
    totalQuestions: 30,
    attemptedQuestions: 25,
    correctAnswers: 14,
    wrongAnswers: 11,
    skippedQuestions: 5,
    timeTaken: 60,
    violations: 2,
    startedAt: "2026-09-04T16:00:00",
    submittedAt: "2026-09-04T17:00:00",
    proctoringStatus: "reviewed",
  },

  {
    id: "ATT-015",
    studentId: "STU-015",
    examId: "EXM-003",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 25,
    obtainedMarks: 20,
    percentage: 80,
    totalQuestions: 25,
    attemptedQuestions: 24,
    correctAnswers: 20,
    wrongAnswers: 4,
    skippedQuestions: 1,
    timeTaken: 40,
    violations: 0,
    startedAt: "2026-09-04T17:00:00",
    submittedAt: "2026-09-04T17:40:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-016",
    studentId: "STU-016",
    examId: "EXM-002",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 40,
    obtainedMarks: 34,
    percentage: 85,
    totalQuestions: 40,
    attemptedQuestions: 38,
    correctAnswers: 34,
    wrongAnswers: 4,
    skippedQuestions: 2,
    timeTaken: 70,
    violations: 0,
    startedAt: "2026-09-05T09:00:00",
    submittedAt: "2026-09-05T10:10:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-017",
    studentId: "STU-017",
    examId: "EXM-001",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 30,
    obtainedMarks: 22,
    percentage: 73.33,
    totalQuestions: 30,
    attemptedQuestions: 27,
    correctAnswers: 22,
    wrongAnswers: 5,
    skippedQuestions: 3,
    timeTaken: 55,
    violations: 1,
    startedAt: "2026-09-05T10:00:00",
    submittedAt: "2026-09-05T10:55:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-018",
    studentId: "STU-018",
    examId: "EXM-003",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 25,
    obtainedMarks: 22,
    percentage: 88,
    totalQuestions: 25,
    attemptedQuestions: 25,
    correctAnswers: 22,
    wrongAnswers: 3,
    skippedQuestions: 0,
    timeTaken: 37,
    violations: 0,
    startedAt: "2026-09-05T11:00:00",
    submittedAt: "2026-09-05T11:37:00",
    proctoringStatus: "approved",
  },

  {
    id: "ATT-019",
    studentId: "STU-019",
    examId: "EXM-002",
    attemptNumber: 1,
    status: "completed",
    result: "failed",
    totalMarks: 40,
    obtainedMarks: 22,
    percentage: 55,
    totalQuestions: 40,
    attemptedQuestions: 34,
    correctAnswers: 22,
    wrongAnswers: 12,
    skippedQuestions: 6,
    timeTaken: 90,
    violations: 3,
    startedAt: "2026-09-05T12:00:00",
    submittedAt: "2026-09-05T13:30:00",
    proctoringStatus: "reviewed",
  },

  {
    id: "ATT-020",
    studentId: "STU-020",
    examId: "EXM-001",
    attemptNumber: 1,
    status: "completed",
    result: "passed",
    totalMarks: 30,
    obtainedMarks: 26,
    percentage: 86.67,
    totalQuestions: 30,
    attemptedQuestions: 29,
    correctAnswers: 26,
    wrongAnswers: 3,
    skippedQuestions: 1,
    timeTaken: 49,
    violations: 0,
    startedAt: "2026-09-05T13:00:00",
    submittedAt: "2026-09-05T13:49:00",
    proctoringStatus: "approved",
  },
];


// ======================================================
// 5. SYSTEM CHECK DATA
// ======================================================

export const systemCheck = {
  camera: {
    name: "Camera",
    status: "passed",
    message: "Camera detected successfully",
  },

  microphone: {
    name: "Microphone",
    status: "passed",
    message: "Microphone is working properly",
  },

  browser: {
    name: "Browser",
    status: "passed",
    message: "Browser is supported",
  },

  internet: {
    name: "Internet Connection",
    status: "passed",
    message: "Stable internet connection detected",
  },

  screen: {
    name: "Screen Resolution",
    status: "passed",
    message: "Screen resolution is supported",
  },
};


// ======================================================
// 6. FACE VERIFICATION
// ======================================================

export const faceVerification = {
  studentId: "STU-001",

  status: "verified",

  confidence: 97.8,

  attempts: 1,

  verifiedAt: "2026-09-05T14:02:00",

  message: "Face verified successfully",

  checks: {
    faceDetected: true,
    multipleFaces: false,
    faceCentered: true,
    sufficientLighting: true,
    imageQuality: "good",
  },
};


// ======================================================
// 7. CURRENT STUDENT ATTEMPT
// ======================================================

export const currentAttempt = {
  id: "ATT-CURRENT-001",

  studentId: "STU-001",

  examId: "EXM-001",

  status: "ready",

  attemptNumber: 2,

  timeRemaining: 3600,

  currentQuestion: 1,

  answers: {},

  startedAt: null,

  submittedAt: null,

  violations: 0,

  proctoringStatus: "active",
};


// ======================================================
// 8. STUDENT DASHBOARD DATA
// ======================================================

export const studentDashboard = {
  studentId: "STU-001",

  statistics: {
    totalExams: 5,

    completedExams: 2,

    upcomingExams: 2,

    availableExams: 2,

    passedExams: 2,

    failedExams: 0,

    averageScore: 83.67,

    highestScore: 90,

    totalAttempts: 2,
  },

  recentResults: [
    {
      examId: "EXM-001",
      examName: "JavaScript Fundamentals",
      score: 83.33,
      result: "passed",
      date: "2026-09-03",
    },

    {
      examId: "EXM-003",
      examName: "Database Management",
      score: 84,
      result: "passed",
      date: "2026-09-01",
    },
  ],

  upcomingExams: [
    {
      examId: "EXM-002",
      title: "React.js Development",
      date: "2026-09-06",
      duration: 90,
    },

    {
      examId: "EXM-004",
      title: "Data Structures & Algorithms",
      date: "2026-09-12",
      duration: 75,
    },
  ],
};


// ======================================================
// 9. RESULT DETAILS
// ======================================================

export const resultDetails = {
  "ATT-001": {
    attemptId: "ATT-001",

    studentId: "STU-001",

    examId: "EXM-001",

    examTitle: "JavaScript Fundamentals",

    totalMarks: 30,

    obtainedMarks: 25,

    percentage: 83.33,

    result: "passed",

    passingMarks: 18,

    grade: "A",

    rank: 4,

    totalStudents: 20,

    correctAnswers: 25,

    wrongAnswers: 3,

    skippedQuestions: 2,

    timeTaken: "52 minutes",

    violations: 1,

    proctoringStatus: "approved",

    submittedAt: "2026-09-03T11:52:00",
  },
};


// ======================================================
// 10. PREVIOUS RESULTS
// ======================================================

export const previousResults = [
  {
    id: "ATT-001",
    studentId: "STU-001",
    examId: "EXM-001",
    examTitle: "JavaScript Fundamentals",
    score: 25,
    totalMarks: 30,
    percentage: 83.33,
    grade: "A",
    result: "passed",
    date: "2026-09-03",
  },

  {
    id: "ATT-003",
    studentId: "STU-001",
    examId: "EXM-003",
    examTitle: "Database Management",
    score: 21,
    totalMarks: 25,
    percentage: 84,
    grade: "A",
    result: "passed",
    date: "2026-09-01",
  },
];


// ======================================================
// 11. HELPER FUNCTIONS
// ======================================================

export const getStudentById = (studentId) => {
  return students.find(
    (student) => student.id === studentId
  );
};


export const getExamById = (examId) => {
  return exams.find(
    (exam) => exam.id === examId
  );
};


export const getAttemptById = (attemptId) => {
  return examAttempts.find(
    (attempt) => attempt.id === attemptId
  );
};


export const getStudentAttempts = (studentId) => {
  return examAttempts.filter(
    (attempt) => attempt.studentId === studentId
  );
};


export const getStudentResults = (studentId) => {
  return examAttempts.filter(
    (attempt) =>
      attempt.studentId === studentId &&
      attempt.status === "completed"
  );
};


export const getExamQuestions = (examId) => {
  return examQuestions[examId] || [];
};


export const getAvailableExams = () => {
  return exams.filter(
    (exam) => exam.status === "available"
  );
};


export const getUpcomingExams = () => {
  return exams.filter(
    (exam) => exam.status === "upcoming"
  );
};
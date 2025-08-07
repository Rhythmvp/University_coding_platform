const courses = {
    'cse': {
        id: 'cse',
        title: 'Computer Science and Engineering',
        image: '/images/course-details/Web-development.jpg',
        description: 'A core program designed to prepare students for dynamic tech careers through structured coding practice, AI-driven interview preparation, and hands-on development experience.',
        features: [
            'Integrated smart coding environment with live code execution',
            'AI-powered mock interviews to simulate real hiring scenarios',
            'Performance analytics to track student progress and readiness',
            'Peer collaboration features including real-time pair programming',
            'Electives in AI, Cybersecurity, Machine Learning, and Data Structures'
        ],
        benefits: [
            {
                title: 'Career-Aligned Curriculum',
                description: 'Develops job-ready skills with a focus on coding, problem-solving, and system design.'
            },
            {
                title: 'Interview Readiness',
                description: 'Simulated technical and behavioral interviews with personalized AI feedback.'
            },
            {
                title: 'Data-Driven Progress Tracking',
                description: 'Students and professors can monitor skills, growth, and placement preparedness.'
            },
            {
                title: 'Collaborative Learning',
                description: 'Encourages study groups, live coding with peers, and shared problem-solving.'
            }
        ],
        outcomes: [
            'Build scalable software using multiple programming languages',
            'Crack coding interviews through hands-on practice and mock sessions',
            'Master advanced data structures and algorithms',
            'Demonstrate clear technical communication in interviews',
            'Use AI feedback to refine logic and presentation skills',
            'Track personal growth using visual analytics and readiness scores'
        ],
        duration: '4 Years',
        startDate: 'August 2025',
        fee: 450000,
        successRate: 92,
        seatsAvailable: 120,
        requirements: [
            'Minimum 70% in 10+2 with PCM (Physics, Chemistry, Mathematics)',
            'Valid score in JEE Main/Advanced or equivalent entrance exam',
            'Strong logical reasoning and programming aptitude'
        ]
    },

    'business': {
        id: 'business',
        title: 'Business and Management',
        image: '/images/course-details/business-management.jpg',
        description: 'Focused on building tech-savvy business leaders through analytical training, AI-driven communication feedback, and project-based learning integrated into a digital career prep platform.',
        features: [
            'Behavioral AI interview simulator to build communication and leadership skills',
            'Case-based learning and project collaboration',
            'Peer review and soft skill development via feedback loops',
            'Global business modules with placement preparation support',
            'Interactive dashboard for skill tracking and self-improvement'
        ],
        benefits: [
            {
                title: 'Leadership & Communication Focus',
                description: 'Behavioral interview feedback helps shape confident business professionals.'
            },
            {
                title: 'Real-time Analytics',
                description: 'Students and professors can view progress across soft and hard skills.'
            },
            {
                title: 'Job Readiness Support',
                description: 'Mock interviews, resume building, and career dashboards tailored to students.'
            },
            {
                title: 'Peer Networking',
                description: 'Collaborate on business cases and management simulations.'
            }
        ],
        outcomes: [
            'Demonstrate strategic thinking and real-time problem solving',
            'Perform confidently in behavioral interviews with AI feedback',
            'Track progress using personalized dashboards',
            'Effectively collaborate in team-based simulations',
            'Lead with confidence in business and tech-driven environments'
        ],
        duration: '3 Years',
        startDate: 'September 2025',
        fee: 380000,
        successRate: 88,
        seatsAvailable: 150,
        requirements: [
            'Minimum 65% in 10+2 from any stream',
            'Entrance test and personal interview',
            'Good interpersonal skills and interest in technology-driven business'
        ]
    },

    'mechanical': {
        id: 'mechanical',
        title: 'Mechanical Engineering',
        image: '/images/course-details/mechanical-engineering.jpg',
        description: 'This program integrates core mechanical knowledge with real-time collaborative tools and AI-driven assessment to prepare students for modern industry roles.',
        features: [
            'Tech-assisted problem solving with coding elements in simulation tools',
            'Live collaboration for mechanical design challenges',
            'AI-powered technical interview prep in core mechanical subjects',
            'Project submissions with automated evaluation and peer review',
            'Analytics-driven tracking of student engineering competencies'
        ],
        benefits: [
            {
                title: 'Hybrid Skill Development',
                description: 'Blends traditional mechanical engineering with technical coding exposure.'
            },
            {
                title: 'Simulated Real-World Assessments',
                description: 'Students build confidence through virtual labs, AI feedback, and project defense.'
            },
            {
                title: 'Career Mapping',
                description: 'Platform matches student strengths with mechanical industry needs.'
            },
            {
                title: 'Collaborative Prototyping',
                description: 'Team-based projects and shared design workspaces build teamwork and leadership.'
            }
        ],
        outcomes: [
            'Design and simulate mechanical systems using modern tools',
            'Tackle technical interview questions with AI support and feedback',
            'Apply critical thinking to real-world mechanical challenges',
            'Collaborate in cross-functional teams effectively',
            'Track development through skill dashboards'
        ],
        duration: '4 Years',
        startDate: 'August 2025',
        fee: 420000,
        successRate: 90,
        seatsAvailable: 100,
        requirements: [
            'Minimum 70% in 10+2 with PCM',
            'Score in JEE or equivalent',
            'Interest in mechanics, simulation, and engineering design'
        ]
    }
};

module.exports = courses;

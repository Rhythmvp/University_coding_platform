const express = require('express')
const path = require('path')
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectDB = require('./db/config');

const app = express()
const PORT = 8080

// Connect to MongoDB
connectDB();

// Session configuration
app.use(session({
    secret: 'rizzards-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

const errorHandler = require('./middlewares/errorHandler')
const courses = require('./data/courseData');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(helmet({
    contentSecurityPolicy: false, 
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// Authentication middleware
const checkAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/');
};

// Admin middleware
const checkAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).render('error', { message: 'Admin access required' });
};

const apiRoutes = require('./api/apiRoutes')
const assessmentRoutes = require('./api/assessmentRoutes')
app.use('/api', apiRoutes)
app.use('/api', assessmentRoutes)

app.get('/', (req, res) => {
    res.render('login', { error: undefined, username: '' });
})

app.get('/register', (req, res) => {
    res.render('register', { error: undefined, formData: {} });
})

app.get('/dashboard', (req, res) => {
    const isLoggedIn = req.session && req.session.user;
    const userRole = isLoggedIn ? req.session.user.role : null;
    res.render('dashboard', { 
        currentPage: 'home',
        isLoggedIn: isLoggedIn,
        userRole: userRole
    });
})

app.get('/course', checkAuth, (req, res) => {
    const userRole = req.session.user.role;
    res.render('course', { currentPage: 'course', userRole: userRole });
})

app.get('/course-details/:id', checkAuth, (req, res) => {
    const courseId = req.params.id;
    const course = courses[courseId];
    if (!course) {
        return res.status(404).render('404', { message: 'Course not found' });
    }
    const userRole = req.session.user.role;
    res.render('course-details', { course, currentPage: 'course', userRole: userRole });
});

app.get('/assessment', checkAuth, (req, res) => {
    const userRole = req.session.user.role;
    res.render('assessment', { currentPage: 'assessment', userRole: userRole });
})

app.get('/assessment/:id', checkAuth, (req, res) => {
    const userRole = req.session.user.role;
    res.render('assessment-detail', { 
        currentPage: 'assessment', 
        userRole: userRole,
        assessmentId: req.params.id 
    });
})

app.get('/admin/dashboard', checkAdmin, (req, res) => {
    const isLoggedIn = req.session && req.session.user;
    const userRole = isLoggedIn ? req.session.user.role : null;
    res.render('admin-dashboard', { currentPage: 'admin-dashboard', userRole: userRole, isLoggedIn: isLoggedIn });
})

app.get('/admin/assessments', checkAdmin, (req, res) => {
    const isLoggedIn = req.session && req.session.user;
    const userRole = isLoggedIn ? req.session.user.role : null;
    res.render('admin-assessments', { currentPage: 'admin-dashboard', userRole: userRole, isLoggedIn: isLoggedIn });
})

app.get('/admin/reports', checkAdmin, (req, res) => {
    const isLoggedIn = req.session && req.session.user;
    const userRole = isLoggedIn ? req.session.user.role : null;
    res.render('admin-reports', { currentPage: 'admin-dashboard', userRole: userRole, isLoggedIn: isLoggedIn });
})

app.get('/about', (req, res) => {
    const isLoggedIn = req.session && req.session.user;
    const userRole = isLoggedIn ? req.session.user.role : null;
    res.render('about', { 
        currentPage: 'about',
        isLoggedIn: isLoggedIn,
        userRole: userRole
    });
})

app.get('/review', checkAuth, (req, res) => {
    const userRole = req.session.user.role;
    res.render('review', { currentPage: 'review', userRole: userRole });
})

app.get('/ourteam', (req, res) => {
    const isLoggedIn = req.session && req.session.user;
    const userRole = isLoggedIn ? req.session.user.role : null;
    res.render('ourteam', { 
        currentPage: 'ourteam',
        isLoggedIn: isLoggedIn,
        userRole: userRole
    });
})

app.get('/event', checkAuth, (req, res) => {
    const userRole = req.session.user.role;
    res.render('event', { currentPage: 'hackathon', userRole: userRole });
})

app.get('/form', checkAuth, (req, res) => {
    const userRole = req.session.user.role;
    res.render('form', { 
        currentPage: 'form',
        userRole: userRole,
        success: req.query.success === 'true'
    });
})

app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
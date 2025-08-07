const express = require('express');
const router = express.Router();
const User = require('../db/models/User');
const CourseApplication = require('../db/models/CourseApplication');
const EventRegistration = require('../db/models/EventRegistration');

const checkUserCredentials = async (username, password) => {
  try {
    const user = await User.findOne({ username, password });
    return user;
  } catch (error) {
    throw error;
  }
};

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).render('login', { 
        error: 'Username and password are required',
        username: username || '' 
      });
    }
    
    const user = await checkUserCredentials(username, password);
    
    if (user) {
      req.session.user = {
        id: user._id,
        username: user.username,
        role: user.role
      };
      return res.redirect('/dashboard');
    } else {
      return res.render('login', { 
        error: 'Invalid username or password', 
        username: username 
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, role = 'consumer' } = req.body;
    
    if (!username || !email || !password) {
      return res.render('register', {
        error: 'All fields are required',
        formData: req.body
      });
    }

    const newUser = new User({ username, email, password, role });
    await newUser.save();
    res.redirect('/');
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.render('register', {
        error: 'This username is already taken. Please choose a different username.',
        formData: req.body
      });
    }
    res.render('register', {
      error: 'An error occurred during registration. Please try again.',
      formData: req.body
    });
  }
});

// Create admin user (for initial setup)
router.post('/create-admin', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newAdmin = new User({ 
      username, 
      email, 
      password, 
      role: 'admin' 
    });
    await newAdmin.save();
    res.json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Admin creation error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'An error occurred during admin creation' });
  }
});

router.post('/submit-event-registration', async (req, res, next) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      dob,
      gender,
      event, 
      otherEvent,
      college, 
      role,
      guests,
      requirements,
      referral,
      newsletter
    } = req.body;

    if (!name || !email || !phone || !college || !(event || otherEvent)) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const newRegistration = new EventRegistration({
      name,
      email,
      phone,
      personal: {
        dob: dob || null,
        gender: gender || 'Not specified'
      },
      eventDetails: {
        eventName: event === 'Other' ? otherEvent : event,
        college,
        role: role || 'Not specified',
        guests: parseInt(guests) || 0
      },
      additionalInfo: {
        requirements: requirements || '',
        referral: referral || 'Not specified',
        subscribedToNewsletter: newsletter === 'yes'
      }
    });

    await newRegistration.save();
    res.status(200).redirect('/form?success=true');
  } catch (error) {
    next(error);
  }
});

router.post('/submit-course-application', async (req, res, next) => {
  try {
    const { 
      courseId, 
      courseTitle, 
      fullName: name, 
      email, 
      phone, 
      qualification, 
      address, 
      whyJoin 
    } = req.body;
    
    if (!courseId || !courseTitle || !name || !email || !phone) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const newApplication = new CourseApplication({
      name,
      email,
      phone,
      course: courseTitle,
      message: whyJoin
    });

    await newApplication.save();
    return res.redirect(`/course-details/${courseId}?success=true`);
  } catch (error) {
    next(error);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
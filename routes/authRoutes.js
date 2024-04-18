const express = require('express');
const {createUser,loginUser,getUserDetails} = require('../controllers/authController');
const router = express.Router();

router.post('/auth',loginUser)
router.post('/create-user',createUser)
router.get('/get-details',getUserDetails)


module.exports = router;
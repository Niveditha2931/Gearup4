const express = require('express');
const { createCategory, getCategories } = require('../controllers/categoryController');

const router = express.Router();

router.post('/add', createCategory);
router.get('/all', getCategories);

module.exports = router;

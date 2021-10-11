const express = require('express')
const router = express.Router()

// @route   GET api/posts
// @desc    Get all users posts
// @access  Private
router.get('/', (req, res) => {
  res.send('Get all users posts')
})

// @route   POST api/posts
// @desc    Add new post
// @access  Private
router.post('/', (req, res) => {
  res.send('Add new post')
})

// @route   PUT api/posts/:id
// @desc    Update post
// @access  Private
router.put('/', (req, res) => {
  res.send('Update post')
})

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/', (req, res) => {
  res.send('Delete post')
})

module.exports = router
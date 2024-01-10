const express = require('express')
const router = express.Router()
const { chatWithOpenAi} = require('../controller/chatbotController')

router.post('/chat-with-me', chatWithOpenAi);

module.exports = router;
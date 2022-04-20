const router = require('express').Router()
const {findUser,createUser,createTokens,returnTokens} = require('./middlewares')

router.post('/register',findUser,createUser,createTokens,returnTokens)
router.post('/login',findUser,checkPass,createTokens,returnTokens)

module.exports = router
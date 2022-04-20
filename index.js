const express = require('express')
require('dotenv').config()
const auth = require('./auth/index')
const company = require('./company/index')
const user = require('./users/index')

const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 80
app.use(cors())
app.use(express.json())

app.use('/api/auth',auth)
app.use('/api/company',company)
app.use('/api/user',user)
app.all('*',(req,res)=>{res.send('WHy')})
app.listen(PORT,()=>console.log(`live on PORT ${PORT}`))
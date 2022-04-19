const express = require('express')
require('dotenv').config()
const {Employee} = require('./schema.js')
const app = express()
const PORT = process.env.PORT || 80

app.use(express.json())
console.log(Employee)

app.listen(PORT,()=>console.log(`live on PORT ${PORT}`))
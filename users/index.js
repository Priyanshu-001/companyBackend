const {verifyJWT,getUserById} = require('../utils')
const router = require('express').Router()


const  daysFromMs = ms=>ms/(1000*60*60*24)
router.get('/profile',verifyJWT,getUserById,(req,res)=>{
	const {user} = req
	user.companies.populate({path: 'company'})
	const {name,username,companies,currentCompany} = user
	workHistory = companies.map(data=>({
		...data,
		daysWorked: daysFromMs(data.dateJoined - (data.dataLeft || Date.now()) ),
		currentCompany: data.currentCompany == data.company
	}))
	return res.json({name,username,workHistory,currentCompany})
})

module.exports = router
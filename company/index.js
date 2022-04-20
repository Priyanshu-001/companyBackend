const {createCompany,getCompanyById} = require('./middlewares')
const {verifyJWT,getUserById} = require('../utils')
const router = require('express').Router()

router.use(getCompanyById)
router.post('/new',verifyJWT,getUserById,createCompany)

router.get('/:id',async (req,res)=>{

	const company = req.company
	await company.populate('employees',['name','username'])
	const employees = company.employees
	const currentEmployees = employees.filter(employee=>(employee.currentCompany==company._id))
	const formerEmployees = employees.filter(employee=>(employee.currentCompany!=company._id))

	const {name,founder,description} = company
	const companyInfo = {name,founder,description} 

	return res.json({formerEmployees,currentEmployees, companyInfo})
})


router.post('/:id/join',verifyJWT,getUserById,async (req,res)=>{
	const user = req.user
	const company = req.company
	if(user.currentCompany != company._id)
		return res.status(409).json({msg:'Error cant join 2 companies at a time'})
	if(user.currentCompany == company._id)
		return res.json({msg:'Already part of the the company'})
	try{
		user.companies.push({
			company:company._id
		})
		user.currentCompany = company._id
		company.employees.push({

		})
		await user.save()
		return res.sendStatus(200)

	}
	catch(err){
		console.log(err)
		return res.status(500).json({msg:'Error while saving info'})
	}

})

router.post('/:id/leave',verifyJWT,getUserById, async (req,res)=>{
	const {user,company} = req
	if(user.currentCompany != company._id)
		return res.status(409).json({msg:'You cant leave what you didnt join'})
	try{
		user.companies[user.companies.length - 1] = {
			...user.companies,
			dateLeft: Date.now(),
		}
		await user.save()
		return res.sendStatus(200)
	}
	catch(err){
		console.log(err)
		return res.status(500).json({msg:'Error while saving info'})
	}


})

module.exports = router
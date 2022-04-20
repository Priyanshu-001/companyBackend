const {Company} = require('../schema')
const createCompany = async (req,res)=>{
	const {name,description} = req.body
	if(!name || !description)
		return res.status(400).json({msg:'name or description missing'})
	company = Company({name,description,founder:req.user._id})
	try{
		await company.save()
		return res.json({id:company._id})
	}
	catch(err)
	{
		console.log(err)
		return res.status(500).json({msg:'Error while saving company'})
	}

}
const getCompanyById = async (req,res,next)=>{
	const {id:_id} = req.params
	Company.findOne({_id},(err,company)=>{
		if(err)
			return res.status(500).json({msg:'Error while reading from DB'})
		if(!company)
			return res.status(404).json({msg:'Incorrect id'})
		req.company = company
		next()
	})
}
module.exports = {createCompany,getCompanyById}


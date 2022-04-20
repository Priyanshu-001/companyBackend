const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const {Employee} = require('../schema')

const findUser = async (req,res,next)=>{

	const {username,name} = req.body

	if(!username)
		return res.status(400).json({msg:'username no provided'})
	else if(!name)
		return res.status(400).json({msg:'name not provided'})

	Employee.findOne({username},(err,doc)=>{
		if(err)
				return res.status(500).json({msg:'Error reading from DB'})
		else if(!doc)
			{
				req.userExists = false
			}
		else {
			req.userExists = true
			req.user = doc
		}
		return next()
	})
}

const checkPass = (req,res,next)=>{
	const {password} = req.body
	if(!req.userExists)
		return res.status(400).json({msg:'Username doesnt exists'})
	try{
			const salt = crypto.randomBytes(16).toString('hex')
			const hashed = crypto.pbkdf2Sync(password,req.user.salt,20,32,'sha256')
			const userPass = Buffer.from(req.user.passwordHash,'hex')

			if (!crypto.timingSafeEqual(hashed,userPass))
				return res.status(401).json({msg:'Incorrect Password'})
			return next()
		}
	catch(err){
		console.log(err)
		return res.status(500).json({msg:'Error Checking password'})
	}
}

const createUser = async (req,res,next)=>{
	if(req.userExists)
		return res.status(409).json({msg:'username already taken'})
	const {password} = req
	if(!password)
		return res.status(400).json({msg:'no password provided'})
	try{
		const salt = crypto.randomBytes(16).toString('hex')
		const hashed = crypto.pbkdf2Sync(password,salt,20,32,'sha256')
		const passwordHash = hashed.toString('hex')
		const newUser = new Employee({name,username,passwordHash,salt})
		await newUser.save()
		req.user = newUser
		return next()
	}
	catch(err){
		console.log(err)
		return res.status(500).json({msg:'error saving user'})
	}

}

const createTokens = (req,res,next)=>{
		const {name,username,_id} = req.user.toObject()
		req.JWT = jwt.sign({name,username,_id},process.env.JWT_SECRET)
		return next()
}

const returnTokens = (req,res)=>{
	const {JWT}= req
	return res.json({JWT})
}

module.exports = {findUser,checkPass,createUser,createTokens,returnTokens}

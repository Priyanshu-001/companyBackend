const verifyJWT = async (req,res,next)=>{
	 jwt.verify(req.headers['authorization'],process.env.JWT_SECRET,
	 	(err,user)=>{
	 		  console.log(user)
			  if(err) return res.sendStatus(401)
			  else if(!user) return res.sendStatus(401)
			  req._id = user._id
			  req.username = user.username
			  req.authorized = true
				next()
			  })
}
const getUserById = async (req,res,next)=>{
	User.findOneByid({_id:req._id},(err,user)=>{
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
module.exports ={verifyJWT,getUserById}
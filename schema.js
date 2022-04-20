const mongoose = require('mongoose')
const { Schema } = mongoose
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true,autoIndex: false })
.then(()=>{
	console.log('DB connected')
})

const employeeSchema = Schema({
	username:{
		type:String,
		unique:true,
		indexed:true,
	},
	name:String,
	passwordHash:String,
	salt:String,
	currentlyEmployed:Boolean,
	companies:[{
				dateJoined:{
					type:Number,
					default:()=>Date.now()
				},
				dateLeft:Number,
				company:{
					type:Schema.Types.ObjectId,
					ref:'Company',
			},
		}
	],
})

const companySchema = Schema({
	name:String,
	employees:[
		
		{
				type:Schema.Types.ObjectId,
				ref:'Employee',
		}
	],
	founder:Schema.Types.ObjectId,
	description:String,
	foundingDate:{
		type:Number,
		default:()=>Date.now()
	},

})

const Employee = mongoose.model('Employee',employeeSchema)
const Company = mongoose.model('Company',companySchema)

module.exports = {Employee, Company}
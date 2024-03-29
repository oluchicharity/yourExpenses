const mongoose= require("mongoose")

const { string } = require("@hapi/joi")
const validCategories = ['Food', 'Utilities', 'Education', 'Other'];
const expenseSchema= new mongoose.Schema({
    Firstname:{
        type:String,
        required:true
    },
    Lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
   phoneNumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true},
    // },
    // description:{
    //     type:String
    // },
    newCode:{
        type:String
    },

    userInput:{
        type:String
    },
    
    expenses: [
        {
            category: {
                type: String,
                enum: validCategories
            },
            amount: Number,
            description: String
        }
    ],

    isAdmin:{
        type:Boolean,
        default:false
        
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    
    token:{
        type:String
        
    // },
    // profilepicture:{
    //     public_id:{
    //         type:String,
    //         required:false
    //     },
    //     url:{
    //         type:String,
    //         required:false
    //     },
    }
    

},{timestamps:true})

// expenseSchema.pre("save", async function (next){
//     const salt= await bcrypt.genSaltSync(12)
//     this.password= await bcrypt.hash(this.password,salt)
//  })
//  expenseSchema.methods.isPasswordMatched= async function (enteredPassword){
//     return await  bcrypt.compare(enteredPassword,this.password)
// }

  const expenseModel= mongoose.model("expenses",expenseSchema)

  module.exports= expenseModel
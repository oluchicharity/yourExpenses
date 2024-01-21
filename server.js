const express= require("express")
require('dotenv').config()
const cors= require("cors")
const db= require("./config/config")
const app= express()
const router= require("./router/router")
const fileUpload= require("express-fileupload")
app.use(fileUpload({
    useTempFiles:true,
    limits:{fileSize:5 * 1024 * 1024}
}))
app.use(express.json())
app.use(cors())
app.get("/",(req,res)=>{
res.send('welcome to Expense tracker')
})
app.use("/api/v1",router)
const PORT= 2002
app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})
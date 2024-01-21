const mongoose= require("mongoose")

// const dbhost= "localhost:27017"

// const dbname= "Expense"

mongoose.connect(`mongodb+srv://agbakwuruoluchi29:ilmaw5oRyBIKQ2DB@cluster0.wqncxtt.mongodb.net/yourExpenses`).then(()=>{
    console.log(`connected to mongoose `)
}).catch((error)=>{
    console.log(error.message)
})

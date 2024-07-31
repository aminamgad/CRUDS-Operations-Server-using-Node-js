const express = require('express')
const app = express()
const path = require('path')

const dotenv = require("dotenv")
dotenv.config()
const PORT = process.env.PORT
const userRoutes = require("./routes/user.route")

const db = require('./config/db')

db();

//Middelewares to parse json
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/users",userRoutes)


app.use(express.static(path.join(__dirname , 'public')))
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname , "templates" , 'index.html'))
})



app.listen(PORT,()=>{
    console.log(`Server is running in http://localhost:${PORT}`);
})
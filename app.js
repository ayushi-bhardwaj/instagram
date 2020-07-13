const express=require('express');
const mongoose=require('mongoose')
const app=express();
const port=process.env.PORT||5000;
const {MONGOURI} = require('./config/key');

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology: true 
});

mongoose.connection.on('connected',()=>{
    console.log('connected to mongo yeahh')
})

mongoose.connection.on('error',(err)=>{
    console.log('err connection',err)
})
require('./models/user');
require('./models/posts')
app.use(express.json())
app.use(require('./routes/auth'))

app.use(require('./routes/post'))

app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path=require('path');
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
app.listen(port,(req,res)=>{
    console.log("server is running")
})

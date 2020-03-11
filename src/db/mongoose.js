const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL,
{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:false})




/*
const me = new User({name : 'Mickaelea',age : 25, email : 'mikaeal@gmail.com',password:'ampases'})
me.save().then(()=>console.log(me)).catch((error)=>console.log(error))
*/


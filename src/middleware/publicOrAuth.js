const jwt = require('jsonwebtoken')
const User = require('../models/user')
const publicOrAuth = async (req,res,next) =>{
    console.log(req.header("Authorization"))
    if (req.header('Authorization')){
        try{
            const token = req.header('Authorization').replace('Bearer ','')
            const decoded = jwt.verify(token,'arthurguedon')
            const user = await User.findOne({_id : decoded._id,'tokens.token':token})
            if(!user){
                throw new Error('')
            }
            req.token = token
            req.user = user
            next()
            }catch(e){
                res.send(e)
            }
    }
    else{
        next()
    }
    

}

module.exports = publicOrAuth
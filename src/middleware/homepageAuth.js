const jwt = require('jsonwebtoken')
const User = require('../models/user')

const homepageAuth = async (req,res,next)=>{
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
    else {
        
    }
    
    
}



module.exports = homepageAuth
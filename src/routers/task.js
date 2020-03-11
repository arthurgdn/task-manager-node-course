const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks',auth, async(req, res) => {
    
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    req.user.taskCount += 1
    if(req.body.completed===false){
        req.user.taskIncomplete += 1
    }
    
    try {
        await req.user.save()
        await task.save()
        res.status(201).send(task)
    }
    catch(e) {
        res.status(400).send(e)
    }
    
})
//GET /tasks?completed=true
// /tasks?limit=10&skip=10 (second page of ten)
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async (req,res)=>{
    
    const match = {}
    const sort = {}
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] ==='desc' ? -1 : 1
    }
    if (req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    try {
        await req.user.populate({
            path : 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(500).send(e)
    }
    
})

router.get('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id

    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id: _id, owner : req.user._id})
        if (!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
    

})

router.patch('/tasks/:id',auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
    if (!isValidOperation){
        return res.status(400).send({error : 'Invalid updates'})
    }
    
    try{
        if (req.body.completed===true){
            req.user.taskIncomplete -=1
        }
        else if(req.body.completed===false){
            req.user.taskIncomplete +=1
        }
        const task = await Task.findOne({_id : req.params.id, owner : req.user._id})
        
        
        //const task = await Task.findByIdAndUpdate(_id,req.body,{new : true,runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await req.user.save()
        await task.save()
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req,res)=>{

    try {
        req.user.taskCount -=1
        

        
        const task = await Task.findOneAndDelete({_id : req.params.id,owner : req.user._id})
        if (task.completed===false){
            req.user.taskIncomplete -=1
        }
        await req.user.save()
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

module.exports = router
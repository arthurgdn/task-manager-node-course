const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const publicOrAuth = require('../middleware/publicOrAuth')
const homepageAuth = require('../middleware/homepageAuth')
const getCookie = require('../../public/js/getCookie')
const router = new express.Router()
const name = "Arthur Guédon"

router.get('',(req,res)=>{

        res.render('index',{
            title:"Accueil",
            name
        })

})
router.get('/task_manager',(req,res)=>{
    res.render('task_manager',{
        title:"Accueil",
        name
    })
})

router.get('/new',(req,res)=>{
    res.render('new',{
        title:"Nouvelle Tâche",
        name
    })
})
router.get('/profile',(req,res)=>{
    res.render('profile',{
        title:"Profile",
        name
    })
})









router.get('*',(req,res)=>{
    res.render('error'),{
        title:"Erreur",
        name,
        message: "Erreur 404"
    }
})

module.exports = router
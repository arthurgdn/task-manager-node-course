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
        title:"Accueil",
        name
    })
})
router.get('/profile',(req,res)=>{
    res.render('profile',{
        title:"Accueil",
        name
    })
})







router.get('/about',(req,res)=>{
    res.render('about',{
        title : "A propos",
        name
    })
})
router.get('/help',(req,res)=>{
    res.render('help',{
        title: "Aide",
        message :"Connectez vous ou inscrivez vous pour pouvoir créer des tâches et les gérer.",
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
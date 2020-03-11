const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const navigationRouter = require('./routers/navigation')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const path = require('path')
const hbs = require('hbs')
const publicPath = path.join(__dirname,'../public')
const partialsPath = path.join(__dirname,'../templates/partials')
const viewsPath = path.join(__dirname,'../templates/views')
const bodyParser = require('body-parser')



const app = express()
const port = process.env.PORT

app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to use
app.use(express.static(publicPath))

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(navigationRouter)



// const main = async ()=>{
//     // const task = await Task.findById('5e4d948a3cefc12cd4af758f')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user = await User.findById('5e4c17cc48b0fd44c037c5fd')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})







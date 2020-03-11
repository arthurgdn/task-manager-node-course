

const getCookie = function (name) {
    var regexp = new RegExp("(?:^" + name + "|;\s*"+ name + ")=(.*?)(?:;|$)", "g");
    var result = regexp.exec(document.cookie);
    return (result === null) ? null : result[1];
  }
function createCookie(name, value, expires, path, domain) {
    var cookie = name + "=" + escape(value) + ";";
  
    if (expires) {
      // If it's a date
      if(expires instanceof Date) {
        // If it isn't a valid date
        if (isNaN(expires.getTime()))
         expires = new Date();
      }
      else
        expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);
  
      cookie += "expires=" + expires.toGMTString() + ";";
    }
  
    if (path)
      cookie += "path=" + path + ";";
    if (domain)
      cookie += "domain=" + domain + ";";
  
    document.cookie = cookie;
  }

  function deleteCookie(name, path, domain) {
    // If the cookie exists
    if (getCookie(name))
      createCookie(name, "", -1, path, domain);
  }

function getSelectedBoxId(e,phrase){
  let i = 0
  let word = ''
  let selectedBoxId = ''
  while (i<e.target.id.length && word !==phrase){
    word = word + e.target.id[i]
    i+=1
      }
  if (i !== e.target.id.length){
    selectedBoxId = e.target.id.slice(i,e.target.id.length)
    }
  return selectedBoxId
}
const token = getCookie('token')
if (token === null) {
    window.open('/','_top')
}

else{
  const loadTasks = async (completedFilterValue)=>{
    idArray =[] 
    
    
    while(document.querySelector('#task-view').childNodes.length>0){
      const taskView = document.querySelector('#task-view')
      taskView.removeChild(taskView.firstChild)
    }
    const taskView = document.querySelector('#task-view')
    let url;
    if(completedFilterValue===0){
      url = '/tasks'
    }
    else if(completedFilterValue===1){
      url = '/tasks?completed=true'
    }
    else if(completedFilterValue===2){
      url = '/tasks?completed=false'
    }
    const response = await fetch(url,{method : "GET",headers : {Authorization : 'Bearer '+ token}})
    const tasks = await response.json()
    for (task of tasks){
        
        const taskElement = document.createElement('div')
        taskElement.style = "padding:5px"
        const creationDate = document.createElement('label')
        creationDate.textContent = task.createdAt.split('T')[0]
        creationDate.style = "font-size : 10px; font-family : arial;"
        taskElement.appendChild(creationDate)
        const taskDescription = document.createElement('div')
        taskDescription.id = "description" + String (idArray.length)
        taskDescription.textContent = task.description
        taskElement.appendChild(taskDescription)
        
        const editButton = document.createElement('button')
        const editToggled =  async (e)=>{
          const selectedBoxId = getSelectedBoxId(e,"editButton")
          console.log(selectedBoxId)
          const description = document.querySelector('#description'+String(selectedBoxId))
          let descriptionText = description.textContent
          description.remove()
          const changeDescription = document.createElement('input')
          changeDescription.id = "description" 
          changeDescription.value = descriptionText
          changeDescription.maxLength = 50
          const editButtonSelected = document.querySelector('#editButton' + selectedBoxId)
          
          taskElement.insertBefore(changeDescription,editButtonSelected)
          changeDescription.focus()
          
          editButtonSelected.textContent = "Enregistrer"
          editButtonSelected.removeEventListener('click',editToggled)
          editButtonSelected.addEventListener('click',async (e)=>{
            e.preventDefault()
            descriptionText = document.querySelector('#description').value
            const response = await fetch('tasks/' + idArray[Number(selectedBoxId)],{method : "PATCH",body : JSON.stringify({description : descriptionText}),headers : {Authorization : 'Bearer '+ token,'Content-type':'application/json'}})
            console.log(response)
            window.open('/task_manager','_top')
          })
        }
        editButton.addEventListener('click',editToggled)
        editButton.textContent = "Modifier"
        editButton.id = "editButton" + String(idArray.length)
        taskElement.appendChild(editButton)
        const completedLabel = document.createElement('label')
        
        completedLabel.textContent = "Terminée"
        completedLabel.for = "completedBox" + String(idArray.length)
        taskElement.appendChild(completedLabel)
        const completedBox = document.createElement('input')
        completedBox.type = "checkbox"
        completedBox.id = "completedBox" +String(idArray.length)
        idArray.push(task._id)
        completedBox.checked = task.completed
        completedBox.addEventListener('change',async (e)=>{
          
          const selectedBoxId = getSelectedBoxId(e,'completedBox')
            const completed = completedBox.checked
            
            const response = await fetch('tasks/' + idArray[Number(selectedBoxId)],{method : "PATCH",body : JSON.stringify({completed}),headers : {Authorization : 'Bearer '+ token,'Content-type':'Application/json'}})
            
            console.log(await response.json())
        })
        taskElement.appendChild(completedBox)
        const deleteButton = document.createElement('button')
        deleteButton.id = 'deleteButton' + String(idArray.length - 1)
        deleteButton.textContent = "X"
        deleteButton.addEventListener('click',async(e)=>{
          if(confirm("Etes vous sûr de vouloir supprimer cette tâche?")){
          const selectedBoxId = getSelectedBoxId(e,'deleteButton')
          const response = await fetch('tasks/' + idArray[Number(selectedBoxId)],{method : "DELETE",headers : {Authorization : 'Bearer '+ token}})
          console.log(await response.json())
          window.open('/task_manager','_top')}
        })
        taskElement.appendChild(deleteButton)
        
        taskView.appendChild(taskElement)

  }}


  const filterTasks = document.querySelector('#filterTasksCompleted')
  filterTasks.addEventListener('change',async(e)=>{
    loadTasks(Number(filterTasks.value))
  })

    document.querySelectorAll('a')[4].setAttribute('style',"border-bottom: 4px solid #333333;color: #333333")
fetch('users/me',{headers:{Authorization : "Bearer "+ token}}).then((response)=>{
    response.json().then((data)=>{
        document.querySelector('#welcome-message').textContent = 'Bienvenue '+data.name+' vous pouvez gérer vos tâches ici!'
    }).catch((e)=>console.log(e))
}).catch((e)=>{console.log(e)})

document.querySelector('#logout').addEventListener('click',async (e)=>{
    e.preventDefault()
    const user = await fetch('/logout',{headers:{Authorization: 'Bearer ' + token}})
    deleteCookie('token')
    window.open('/','_top')
})

window.addEventListener('load',async (e)=>{
    loadTasks(0)
    


    
})


}






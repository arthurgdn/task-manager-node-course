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
const token = getCookie('token')
if (token === null) {
    window.open('/','_top')
}
else{
document.querySelectorAll('a')[2].setAttribute('style',"border-bottom: 4px solid #333333;color: #333333")
fetch('users/me',{headers:{Authorization : "Bearer "+ token}}).then((response)=>{
    response.json().then((data)=>{
      const profilePic = document.createElement('img')
      profilePic.src = '/users/'+data._id+'/avatar'
      
      document.querySelector('#imageBox').insertBefore(profilePic,document.querySelector('#imageBox').firstChild)
      document.querySelector('#name').textContent = data.name
      document.querySelector('#taskCount').textContent = data.taskCount+" tâches créées"
      document.querySelector('#taskIncomplete').textContent = data.taskIncomplete + " tâches à faire"
        document.querySelector('#welcome-message').textContent = 'Bienvenue '+data.name+' tu peux gérer tes tâches ici!'
    }).catch((e)=>{console.log(e)})

}).catch((e)=>{console.log(e)})

document.querySelector('#logout').addEventListener('click',async (e)=>{
    e.preventDefault()
    const user = await fetch('/logout',{Headers:{Authorization: 'Bearer ' + token}})
    deleteCookie('token')
    window.open('/','_top')
})
}
const deleteButton = document.querySelector('#deleteAccount')
deleteButton.addEventListener('click',async(e)=>{
  if(confirm("Etes vous sûr de vouloir supprimer votre compte?")){
  
  const response = await fetch('users/me' ,{method : "DELETE",headers : {Authorization : 'Bearer '+ token}})
  
  deleteCookie('token')
  window.open('/','_top')}
})
document.querySelector('#uploadAvatar').addEventListener('click',()=>{
  const interface = document.querySelector('#uploadInterface')
  if(interface.style.display ==="block"){
      interface.style.display ="none"
  }else{
      interface.style.display = "block"
  }
})

document.querySelector('#toggleChangePass').addEventListener('click',()=>{
  const interface = document.querySelector('#changePassInterface')
  if(interface.style.display ==="block"){
      interface.style.display ="none"
  }else{
      interface.style.display = "block"
  }
})
document.querySelector('#uploadForm').addEventListener('submit',async (e)=>{
  e.preventDefault()
  const file = document.querySelector('[type=file]').files[0];
  const avatarForm = new FormData()
  avatarForm.append('avatar',file)
  
  if(!file.type.startsWith("image")){
    document.querySelector('#uploadTip').textContent = "Le fichier doit être une image"
  }
  else if(file.size<1000000){
    try {
     await fetch('/users/me/avatar',{body:avatarForm,method:"POST",headers:{Authorization : 'Bearer '+token,'Accept':'application/json'}})
    window.open('/profile','_top')
  }
  catch(e){
    document.querySelector('#uploadTip').textContent = "Erreur lors de l'envoi de l'image"
  }

  }
  else{
    document.querySelector('#uploadTip').textContent = "L'image doit être plus petite que 1Mo"
  }

})

let typingTimer;                //timer identifier
const doneTypingInterval = 1000;  //time in ms (5 seconds)


const validatePassLength = ()=>{
  const newPasswordField = document.getElementById('newPass')
  const passwordHelp = document.getElementById('newPassHelp')
          if(newPasswordField.value.length<7 || !newPasswordField.value){
              passwordHelp.textContent = "Le mot de passe doit faire au moins 7 caractères"
              newPasswordField.style.border ="1px solid red"
              return false
          }
          else{
              
              passwordHelp.textContent = ""
              newPasswordField.style.border ="1px solid green"
              return true
          }
}

const validatePassMatch  = ()=>{
  const passwordCheckField = document.getElementById('newPassCheck')
  const passwordCheckHelp = document.getElementById('newPassCheckHelp')
          if(passwordCheckField.value !== document.getElementById('newPass').value || !passwordCheckField.value){
              passwordCheckHelp.textContent = "Les mots de passe doivent être les mêmes"
              passwordCheckField.style.border ="1px solid red"
              return false
          }
          else{
              
              passwordCheckHelp.textContent = ""
              passwordCheckField.style.border ="1px solid green"
              return true
          }
}

const newPasswordField = document.getElementById('newPass')
newPasswordField.addEventListener('onblur',async () => {
    clearTimeout(typingTimer);
    if (newPasswordField.value) {
        typingTimer = setTimeout(()=>{
            validatePassLength()
        }, doneTypingInterval);
    }
});
newPasswordField.addEventListener('keyup',async () => {
    clearTimeout(typingTimer);
    if (newPasswordField.value) {
        typingTimer = setTimeout(()=>{
            validatePassLength()
        }, doneTypingInterval);
    }
});
const passwordCheckField = document.getElementById('newPassCheck')
passwordCheckField.addEventListener('onblur',async () => {
    clearTimeout(typingTimer);
    if (passwordCheckField.value) {
        typingTimer = setTimeout(()=>{
            validatePassMatch()
        }, doneTypingInterval);
    }
});

passwordCheckField.addEventListener('keyup',async () => {
    clearTimeout(typingTimer);
    if (passwordCheckField.value) {
        typingTimer = setTimeout(()=>{
            validatePassMatch()
        }, doneTypingInterval);
    }
});
document.getElementById('changePassForm').addEventListener('submit',async(e)=>{
  e.preventDefault()
  if(validatePassLength()===true && validatePassMatch()===true){
    const password = document.getElementById('newPass').value
    const currentPass = document.getElementById('currentPass').value
    try{
        const response = await fetch('/users/me/password',{body:JSON.stringify({currentPass,password}),method:"PATCH",headers:{Authorization : 'Bearer '+token,'Content-type':'application/json'}})
        if(response.status===200){
        document.getElementById('resultTip').textContent = "Mot de passe changé avec succès !"
        
        document.getElementById('resultTip').style.color = "green"
        setTimeout(()=>{
          document.getElementById('resultTip').textContent = ""
        },2000)
      }else{
        document.getElementById('resultTip').textContent = "Impossible de changer le mot de passe"
        document.getElementById('resultTip').style.color = "red"

      }
      }catch(e){
      document.getElementById('resultTip').textContent = "Impossible de changer le mot de passe"
      document.getElementById('resultTip').style.color = "red"

    }
  }
})
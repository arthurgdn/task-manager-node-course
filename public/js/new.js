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
    document.querySelectorAll('a')[0].setAttribute('style',"border-bottom: 4px solid #333333;color: #333333")
fetch('users/me',{headers:{Authorization : "Bearer "+ token}}).then((response)=>{
    response.json().then((data)=>{
        document.querySelector('#welcome-message').textContent = 'Bienvenue '+data.name+' vous pouvez vos tâches ici!'
    }).catch((e)=>console.log(e))
}).catch((e)=>{console.log(e)})

document.querySelector('#logout').addEventListener('click',async (e)=>{
    e.preventDefault()
    const user = await fetch('/logout',{Headers:{Authorization: 'Bearer ' + token}})
    deleteCookie('token')
    window.open('/','_top')
})
document.querySelector('form').addEventListener('submit',async (e)=>{
    e.preventDefault()
    const description = document.querySelector('textarea').value
    const completed = document.querySelector('input').checked
    const task = await fetch('/tasks',{body:JSON.stringify({description,completed}),method:"POST",headers:{Authorization : 'Bearer '+token,'Content-type':'application/json'}})
    
    document.querySelector('#task-created').textContent = "Nouvelle tâche créée avec succès !"
    document.querySelector('textarea').value = ""
    document.querySelector('input').checked = false
    setTimeout(()=>{
        document.querySelector('#task-created').textContent = ""
    },2000)
})

}

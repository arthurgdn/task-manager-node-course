const getCookie = function (name) {
    var regexp = new RegExp("(?:^" + name + "|;\s*"+ name + ")=(.*?)(?:;|$)", "g");
    var result = regexp.exec(document.cookie);
    return (result === null) ? null : result[1];
  }

 
const token = getCookie('token')
if(token!==null){
    document.querySelector('.main-content').innerHTML = ""
    window.open('/task_manager','_top')
}
else{
const loginForm = document.querySelector('#loginForm')
loginForm.addEventListener('submit', async (e)=>{
    e.preventDefault()
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value
    console.log(email,password)

    const response = await fetch('/users/login',{body:JSON.stringify({email,password}),method:"POST",headers: { 'Content-type': 'application/json' }})
    
    console.log(response)
    if(response.status !== 200){
        document.querySelector('#responseArea').textContent = "Email ou mot de passe incorrect!"
    }
    else{
    const data = await response.json()
    console.log(data)
    document.cookie = "token="+data.token+";path=/"
    window.location.reload(false)}
    
})}
//Affiche le form pour s'inscrire quand on clique sur le boutton
document.querySelector('#showSignup').addEventListener('click',()=>{
    const buttonDisplay = document.querySelector('#signupArea')
    if(buttonDisplay.style.display ==="block"){
        buttonDisplay.style.display ="none"
    }else{
        buttonDisplay.style.display = "block"
    }
})
let typingTimer;                //timer identifier
const doneTypingInterval = 1000;  //time in ms (5 seconds)



const validateEmail = ()=> {
    const signupEmailField = document.getElementById('signupEmail');
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const emailHelp = document.getElementById('emailHelp')
            if(!re.test(signupEmailField.value || !signupEmailField.value)){
                emailHelp.textContent = "Email invalide"
                signupEmailField.style.border ="1px solid red"
                return false
            }
            else{
                
                emailHelp.textContent = ""
                signupEmailField.style.border ="1px solid green"
                return true
            }
  }

  const validatePassLength = ()=>{
    const signupPasswordField = document.getElementById('signupPassword')
    const passwordHelp = document.getElementById('passwordHelp')
            if(signupPasswordField.value.length<7 || !signupPasswordField.value){
                passwordHelp.textContent = "Le mot de passe doit être long d'au moins 7 caractères"
                signupPasswordField.style.border ="1px solid red"
                return false
            }
            else{
                
                passwordHelp.textContent = ""
                signupPasswordField.style.border ="1px solid green"
                return true
            }
  }

  const validatePassMatch  = ()=>{
    const passwordCheckField = document.getElementById('passwordCheck')
    const passwordCheckHelp = document.getElementById('passwordCheckHelp')
            if(passwordCheckField.value !== document.getElementById('signupPassword').value || !passwordCheckField.value){
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

  const signupEmailField = document.getElementById('signupEmail');
//on keyup, start the countdown
signupEmailField.addEventListener('onblur',async () => {
    clearTimeout(typingTimer);
    if (signupEmailField.value) {
        typingTimer = setTimeout(()=>{
            validateEmail()

        }, doneTypingInterval);
    }
});
signupEmailField.addEventListener('keyup',async () => {
    clearTimeout(typingTimer);
    if (signupEmailField.value) {
        typingTimer = setTimeout(()=>{
            validateEmail()

        }, doneTypingInterval);
    }
});
const signupPasswordField = document.getElementById('signupPassword')
signupPasswordField.addEventListener('onblur',async () => {
    clearTimeout(typingTimer);
    if (signupPasswordField.value) {
        typingTimer = setTimeout(()=>{
            validatePassLength()
        }, doneTypingInterval);
    }
});
signupPasswordField.addEventListener('keyup',async () => {
    clearTimeout(typingTimer);
    if (signupPasswordField.value) {
        typingTimer = setTimeout(()=>{
            validatePassLength()
        }, doneTypingInterval);
    }
});
const passwordCheckField = document.getElementById('passwordCheck')
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

document.getElementById('signup').addEventListener('click',async (e)=>{
    e.preventDefault()
    //we validate if the data is well sent
    if(validateEmail()===true && validatePassLength()===true && validatePassMatch()===true){
        const email = document.querySelector('#signupEmail').value
        const password = document.querySelector('#signupPassword').value
        const name = document.querySelector('#signupName').value
        console.log(email,password,name)

        const response = await fetch('/users/',{body:JSON.stringify({email,password,name}),method:"POST",headers: { 'Content-type': 'application/json' }})
        if(response.status!==400){
            const data = await response.json()
            document.cookie = "token="+data.token+";path=/"
            const signupResponseArea = document.getElementById('signupResponse')
            signupResponseArea.textContent="Vous vous êtes inscrit avec succès ! Vous allez être redirigé vers votre gestionnaire de tâches"
            signupResponseArea.style.color = "green"
            setTimeout(()=>{
                signupResponseArea.textContent=""
                window.location.reload(false)
            },3000)
            
        }
        else{
            console.log(response)
        const signupResponseArea = document.getElementById('signupResponse')
        signupResponseArea.textContent="Impossible de s'inscrire !"
        signupResponseArea.style.color = "red"}
    }
    

})




        
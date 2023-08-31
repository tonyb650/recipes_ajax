console.log("script.js running...")
const regexEmail = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
const regForm = document.getElementById('register') // the 'post' form for registering new user
const loginForm = document.getElementById('login') // the 'post' form for logging in existing user
const regErrors = document.getElementById('regErrors') // the 'div' for displaying registration errors
const loginErrors = document.getElementById('loginErrors') // the 'div' for displaying login errors

regForm.onsubmit = function(e){
    e.preventDefault();
    regErrors.innerHTML = '';  // clear error div for registration
    if(regIsValid(regForm)){
        let form = new FormData(regForm);
        console.log("form"+form)
        fetch("http://localhost:5000/user/save", {method:'POST', body:form})
            .then( res => res.json()) // hmm. is this needed ?
            .then( data => {
                // console.table(data);
                window.location.replace('http://localhost:5000/recipes');
                })
            .catch( error => console.log("error "+error)) // not sure what would trigger this
    } else {
        console.log("not valid")
    }
}

loginForm.onsubmit = function(e){
    e.preventDefault();
    loginErrors.innerHTML = ''; // clear error div for login
    let form = new FormData(loginForm);
    console.log("form"+form)
    fetch("http://localhost:5000/user/login", {method:'POST', body:form})
        .then( response => response.json()) 
        .then( data => {
            // console.log("Data ??")
            // console.table(data);
            if(data == true ) {
                window.location.replace('http://localhost:5000/recipes');
            } else {
                renderLoginError(data);
            }
        })
        .catch( error => console.log("error "+error)) // not sure what would trigger this
}

function regIsValid(regFormData){
    // Is this the right way to retrieve the form values on the next few lines? It works, but it doesn't feel like a robust way of doing it
    let fName = regFormData.elements[0].value
    let lName = regFormData.elements[1].value
    let email = regFormData.elements[2].value
    let password = regFormData.elements[3].value
    let confirm_password = regFormData.elements[4].value
    // console.log("fName"+fName)
    // console.log("lName"+lName)
    // console.log("email"+email)
    // console.log("password"+password)
    // console.log("confirm_password"+confirm_password)
    let isValid = true;
    if(fName.length < 2) {
        let message = "First name must be at least 2 characters.";
        // console.log(message);
        renderRegError(message);
        isValid = false;
    }
    if(lName.length < 2) {
        message = "Last name must be at least 2 characters.";
        renderRegError(message);
        isValid = false;
    }
    if(regexEmail.test(email)==false) {
        message = "Email is not valid.";
        renderRegError(message);
        isValid = false;
    }
    if(password.length < 4) {
        message = "Password must be at least 4 characters.";
        renderRegError(message);
        isValid = false;
    }
    if(password != confirm_password) {
        message = "Passwords do not match.";
        renderRegError(message);
        isValid = false;
    }
    return isValid
}


function renderRegError(errorMessage){
    let paragraph = document.createElement('p');
    paragraph.innerHTML = errorMessage;
    regErrors.appendChild(paragraph);
} 

function renderLoginError(errorMessage){
    let paragraph = document.createElement('p');
    paragraph.innerHTML = errorMessage;
    loginErrors.appendChild(paragraph);
} 
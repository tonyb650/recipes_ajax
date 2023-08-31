const recipes = document.getElementById('recipeList');
const addRecipeForm = document.getElementById('createRecipe');
const addRecipeErrors = document.getElementById('recipeErrors');

// The strategy I used to get the 'user_id' for the logged in user was to get the value
// from the hidden form field on the "Add a new recipe" form
// Is there a better way?
const userIdElement = document.getElementById('user_id'); // get the value for 'user_id'
const userID = userIdElement.getAttribute('value') // by pulling the value from the hidden form field

function getRecipes(){
    fetch('http://localhost:5000/recipe/list') // this route returns JSON for all the recipes in the DB
        .then(res => res.json()) // convert the returned JSON to usable 'data' array
        .then(data => {
            for (let i = 0;i < data.length; i++){
                // loop through 'data' area and create a table row for each recipe
                let row = document.createElement(`tr`);
                let name = document.createElement('td');
                name.innerHTML = data[i].name;
                row.appendChild(name);
                let under30 = document.createElement('td');
                if(data[i].under_30 == 1){
                    under30.innerHTML = "Yes";
                } else {
                    under30.innerHTML = "No";
                }
                row.appendChild(under30);
                let firstName = document.createElement('td');
                firstName.innerHTML = data[i].first_name;
                row.appendChild(firstName);
                let actions = document.createElement('td');
                // the following conditional needs the 'userID' that we got from the hidden form field
                if(data[i].user_id == userID){
                    actions.innerHTML = `<a href='/recipe/edit/${data[i].id}'>edit</a> | <a href='/recipe/delete/${data[i].id}'>delete</a>`
                } else {
                    actions.innerHTML = `<a href='/recipe/edit/${data[i].id}'>view</a>`
                }
                row.appendChild(actions);
                const att = document.createAttribute("id");
                att.value = data[i].id;
                row.setAttributeNode(att);
                recipes.appendChild(row);
            }
        })
}

addRecipeForm.onsubmit = function(e){ // 'Add a new recipe' button is clicked
    e.preventDefault();
    addRecipeErrors.innerHTML = '';  // clear validation errors div if there are any
    if(recipeIsValid(addRecipeForm)){
        // enter this conditional if the all the recipe form data is valid
        let form = new FormData(addRecipeForm);
        fetch("http://localhost:5000/recipe/create", {method:"post", body : form}) // send the form data to  controller to save it to the DB
            .then(response => response.json())
            .then(data => {
                // probably would have been good to make this 'html create' a separate function because I'm repeating a lot of code here
                let row = document.createElement('tr');
                let name = document.createElement('td');
                name.innerHTML = data.name;
                row.appendChild(name);
                let under30 = document.createElement('td');
                if(data.under_30 == 1){
                    under30.innerHTML = "Yes";
                } else {
                    under30.innerHTML = "No";
                }
                row.appendChild(under30);
                let firstName = document.createElement('td');
                firstName.innerHTML = data.first_name;
                row.appendChild(firstName);
                let actions = document.createElement('td');
                // no need for conditional render of available 'actions' because by definition this new recipe is made by the current user
                actions.innerHTML = `<a href='/recipe/edit/${data.id}'>edit</a> | <a href='/recipe/delete/${data.id}'>delete</a>`
                row.appendChild(actions);
                recipes.appendChild(row);
                addRecipeForm.reset() // clear the form values
            })
    }
}

function recipeIsValid(addRecipeFormData){
    let name = addRecipeFormData.elements[0].value
    let description = addRecipeFormData.elements[1].value
    let instructions = addRecipeFormData.elements[2].value
    let dateMade = addRecipeFormData.elements[3].value
    let isValid = true;
    if(name.length < 3) {
        renderRecipeError("Recipe name must be at least 3 characters.");
        isValid = false;
    }
    if(description.length < 3) {
        renderRecipeError("Description must be at least 3 characters.");
        isValid = false;
    }
    if(instructions.length < 3) {
        renderRecipeError("Instructions must be at least 3 characters.");
        isValid = false;
    }
    if(dateMade == null || dateMade == "") {
        renderRecipeError("Please select date for recipe.");
        isValid = false;
    }
    // need to add a validation for radio buttons. BUT, the better solution is to just set a default, so that's what I did
    return isValid;
}

function renderRecipeError(errorMessage){
    let paragraph = document.createElement('p');
    paragraph.innerHTML = errorMessage;
    addRecipeErrors.appendChild(paragraph);
} 

// the following two lines run upon first loading of the page
addRecipeForm.reset() // clear the form values
getRecipes();
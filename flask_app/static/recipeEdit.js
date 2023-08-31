console.log("script running...")

const recipe = document.getElementById('recipeShow');
const recipeHead = document.getElementById('recipeHead');
const editRecipeForm = document.getElementById('editRecipeForm');
const validationErrors = document.getElementById('recipeErrors');

// this will run when the page first loads...
// this will get the recipe_id out of session so we can use it in JS
// is there a better way?? it feels awkward.
fetch(`http://localhost:5000/recipe/getSession`)
    .then(res => res.json())
    .then(data => {
        // now that we have the recipe_id, we can render the page elements
        renderElements(data.recipe_id);
})

// only going to run the following function when the page is first rendered
// after that, it will be the 'onsubmit' function
function renderElements(recipe_id){
    console.log('entered renderElements')
    fetch(`http://localhost:5000/recipe/get/${recipe_id}`)
        .then(res => res.json())
        .then(data => {
            renderRecipeDetail(data); // create the HTML for the left side of the screen
            renderRecipeEditForm(data); // create the HTML for the right side of the screen
        })
}

function renderRecipeDetail(data){
    let my_date = new Date(data.date_cooked)
    let dateCookedFormatted = my_date.getFullYear() + "-" +((my_date.getMonth()+1) < 10 ? "0" + (my_date.getMonth() + 1) : (my_date.getMonth()+1)) + "-" + (my_date.getDate()+1 < 10 ?"0" + my_date.getDate()+1 : my_date.getDate()+1);
    recipe.innerHTML = ""
    recipeHead.innerHTML = ""
    let head = document.createElement('h2')
    head.innerText = data.name + ' by ' + data.first_name;
    recipeHead.appendChild(head)
    let description = document.createElement('tr');
    description.innerHTML = `<th>Description</th><td>${data.description}</td>`;
    recipe.appendChild(description);
    let under30 = document.createElement('tr');
    if(data.under_30 == 1){
        under30.innerHTML = `<th>Under 30 min.:</th><td>Yes</td>`;
    } else {
        under30.innerHTML = `<th>Under 30 min.:</th><td>No</td>`;
    }
    recipe.appendChild(under30);
    let instructions = document.createElement('tr');
    instructions.innerHTML = `<th>Instructions</th><td>${data.instructions}</td>`;
    recipe.appendChild(instructions);
    let date_cooked = document.createElement('tr');
    date_cooked.innerHTML = `<th>Date Made:</th><td>${dateCookedFormatted}</td>`;
    recipe.appendChild(date_cooked);
}

// this function creates form to edit the recipe that we are focusing on.
// Not sure if would have been better/possible to create this form in the HTML file
// the way I did for the recipe_list.html page
// Also, for the form, I didn't use .createElement and .appendChild. I wasn't sure if is 
// preferred over making one long string of .innerHTML
function renderRecipeEditForm(data){
    // the following 2 lines format the 'date_cooked' the way we want it. This seems awfully cumbersome...probably a better way ???
    let my_date = new Date(data.date_cooked)
    let dateCookedFormatted = my_date.getFullYear() + "-" +((my_date.getMonth()+1) < 10 ? "0" + (my_date.getMonth() + 1) : (my_date.getMonth()+1)) + "-" + (my_date.getDate()+1 < 10 ?"0" + my_date.getDate()+1 : my_date.getDate()+1);
    editRecipeForm.innerHTML = `
    <input type="hidden" name="id" value="${data.id}">
    <input type="hidden" name="user_id" value="${data.user_id}"> 
    <input type="hidden" name="first_name" value="${data.first_name}">
    <label for="name" class="formlabel">Name</label>
    <input type="text" name="name" id="name" class="forminput" value="${data.name}">
    <label for="description"  class="formlabel">Description</label>
    <textarea name="description" id="description" cols="30" rows="10" class="forminput">${data.description}</textarea>
    <label for="instructions"  class="formlabel">Instructions</label>
    <textarea name="instructions" id="instructions" cols="30" rows="10" class="forminput">${data.instructions}</textarea>
    <label for="date_cooked"  class="formlabel">Date Cooked/Made:</label>
    <input type="date" id="date_cooked" name="date_cooked" class="forminput" value="${dateCookedFormatted}">
    <label for="under_30"  class="formlabel">Under 30 minutes?</label>
    `
    if(data.under_30 == 1){
        editRecipeForm.innerHTML += 
        `<div class="forminput">
        <input type="radio" id="yes" name="under_30" value="1" checked>
        <label for="yes">Yes</label>
        <input type="radio" id="no" name="under_30" value="0">
        <label for="no">No</label><div>`
    } else {
        editRecipeForm.innerHTML += 
        `<div class="forminput">
        <input type="radio" id="yes" name="under_30" value="1">
        <label for="yes">Yes</label>
        <input type="radio" id="no" name="under_30" value="0" checked>
        <label for="no">No</label></div>`
    }
    editRecipeForm.innerHTML += 
        `
        <input type="submit" value="Update Recipe" class="forminput"></input>
        `
}

// When form for editing recipe is submitted
editRecipeForm.onsubmit = function(e){
    e.preventDefault();
    if(recipeIsValid(editRecipeForm)){ //
        // console.log("passed validations")
        let form = new FormData(editRecipeForm);
        fetch("http://localhost:5000/recipe/update", {method:"post", body : form})
            .then(response => response.json())
            .then(data => {
                renderRecipeDetail(data) // update the HTML for the left side of the screen
            })
    }
}

// The following function checks if the form data is valid to update
// returns true if valid or false if not valid
// also calls for errors to be rendered in the html for each failed
// validity test
function recipeIsValid(formData){
    let name = formData.name.value;
    let description = formData.description.value
    let instructions = formData.instructions.value
    let dateMade = formData.date_cooked.value
    // let under30 = formData.under_30.value
    // let under30b = formData.under30b.value
    let isValid = true;
    if(name.length < 3) {
        let message = "Recipe name must be at least 3 characters.";
        // console.log(message);
        renderRecipeError(message);
        isValid = false;
    }
    if(description.length < 3) {
        let message = "Description must be at least 3 characters.";
        // console.log(message);
        renderRecipeError(message);
        isValid = false;
    }
    if(instructions.length < 3) {
        let message = "Instructions must be at least 3 characters.";
        // console.log(message);
        renderRecipeError(message);
        isValid = false;
    }
    if(dateMade == null || dateMade == "") {
        let message = "Please select date for recipe.";
        // console.log(message);
        renderRecipeError(message);
        isValid = false;
    }
    // need to add a validation for radio buttons? (Actually, no. There will always be a 'checked' radio button because there will always be an original value)
    return isValid;
}

// Simple function to create html for non-valid message(s)
function renderRecipeError(errorMessage){
    let paragraph = document.createElement('p');
    paragraph.innerHTML = errorMessage;
    validationErrors.appendChild(paragraph);
} 
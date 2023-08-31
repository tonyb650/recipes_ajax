from flask import render_template, request, redirect, session, flash, jsonify
from flask_app import app
from flask_app.models import recipe

# UPDATED ROUTES
@app.route('/recipes')
def recipe_list_page():
    if 'user_id' not in session:
        print("No user logged in.")
        return redirect ('/login')
    else:
        session.pop('name', None)
        session.pop('description', None)
        session.pop('instructions', None)
        session.pop('date_cooked', None)
        session.pop('under_30', None)
        session.pop('id', None)
        return render_template('recipe_list.html')

@app.route('/recipe/list')
def recipe_list():
    print("in recipe/list")
    recipe_list = recipe.Recipe.get_all()
    return jsonify(recipe_list)

@app.route('/recipe/create', methods=["post"])
def create_recipe():
    # print("rf<30"+request.form['under_30'])
    recipe_id = recipe.Recipe.save(request.form)
    data = {
        'date_cooked' : request.form['date_cooked'],
        'description' : request.form['description'],
        'first_name' : request.form['first_name'],
        'instructions' : request.form['instructions'],
        'name' : request.form['name'],
        'under_30' : request.form['under_30'],
        'user_id' : request.form['user_id'],
        'id' : recipe_id
    }
    return jsonify(data)
    

@app.route('/recipe/edit/<int:recipe_id>')
def recipe_edit_page(recipe_id):
    if 'user_id' not in session:
        print("No user logged in.")
        return redirect ('/login')
    else:
        session['recipe_id'] = recipe_id
        return render_template('recipe_edit.html')
        

@app.route('/recipe/get/<int:recipe_id>')
def get_one_recipe(recipe_id):
    print("in recipe/get")
    recipe_dict = recipe.Recipe.get_one_by_id(recipe_id)
    return jsonify(recipe_dict)

@app.route('/recipe/getSession')
def get_session_json():
    session_dict = {
        'recipe_id' : session['recipe_id'],
        'user_id' : session['user_id']
    }
    return jsonify(session_dict)


@app.route('/recipe/update', methods=["post"])
def update_recipe():
    print('entered update_recipe in python')
    results = recipe.Recipe.update(request.form)
    return jsonify(request.form)


@app.route('/recipe/delete/<int:recipe_id>')
def delete_recipe(recipe_id):
    if 'user_id' not in session:
        print("No user logged in.")
        return redirect ('/login')
    else:
        result = recipe.Recipe.delete(recipe_id)
        return redirect('/recipes') # to avoid this redirect,
        # we could possibly have the delete link not point to 
        # this route, but instead an 'onClick' in the JS that
        # removes the element by id# (i added that to the list of
        # recipes) and *then* fetches this route. Seems awfully
        # clunky and I wonder if there is a better way
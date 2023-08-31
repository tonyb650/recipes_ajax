from flask import render_template, request, redirect, session, flash, jsonify
from flask_app import app
from flask_app.models import user, recipe
from flask_app.controllers import recipes
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt(app)

# Updated Routes
@app.route('/')
@app.route('/login')
def login_page():
    return render_template('/login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

@app.route('/user/save', methods=['post'])
def save_user():
    pw_hash = bcrypt.generate_password_hash(request.form['password'])
    data = {
        'first_name' : request.form['first_name'],
        'last_name' : request.form['last_name'],
        'email' : request.form['email'],
        'password' : pw_hash
    }
    user_id = user.User.save(data)
    session['user_id'] = user_id
    session['user_name'] = request.form['first_name']
    return jsonify(request.form)

@app.route('/user/login', methods=['post'])
def login_user():
    print("entering user/login route")
    session['login_email'] = request.form['email']
    user_obj = user.User.get_one_by_email(request.form['email'])
    if not user_obj: #check if bad email
        message = "There is no account with that email."
        # print("There is no account with that email.")
        return jsonify(message)
    elif not bcrypt.check_password_hash(user_obj.password,request.form['password']): #check for bad password
        message ="Invalid password."
        # print("Invalid password.")
        return jsonify(message)
    else: #success
        session.clear()
        session['user_id']=user_obj.id
        session['user_name'] = user_obj.first_name
        return jsonify(True)
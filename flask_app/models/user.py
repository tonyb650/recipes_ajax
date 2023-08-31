from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash
import re

regex_email = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'

class User:
    DB = 'recipes'
    def __init__(self,data):
        self.id = data['id']
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.email = data['email']
        self.password = data['password']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.recipes = []

    @classmethod
    def save(cls,data):
        query = """
                INSERT INTO users (first_name,last_name,email,password)
                VALUES (%(first_name)s, %(last_name)s, %(email)s, %(password)s);
        """
        return connectToMySQL(cls.DB).query_db(query,data)
    
    @classmethod
    def get_one_by_email(cls,email):
        data = {
            'email' : email
        }
        query = """
                SELECT * FROM users
                WHERE email=%(email)s;
                """
        results = connectToMySQL(cls.DB).query_db(query,data)
        if not results:
            return False
            print('returning false')
        else:
            user_obj = cls(results[0])
            # could add recipes here? no reason in this assignment
            print('returning object')
            return user_obj
    
    @classmethod
    def get_one_by_id(cls,user_id):
        data = {
            'id' : user_id
        }
        query = """
                SELECT * FROM users
                WHERE id=%(id)s;
                """
        results = connectToMySQL(cls.DB).query_db(query,data)
        user_obj = cls(results[0])
        # could add recipes here? no reason in this assignment
        return user_obj
    
    # this method is not needed with AJAX
    @staticmethod
    def user_reg_is_valid(data):
        is_valid = True
        if len(data['first_name'].strip())<2:
            flash("First name must be at least 2 characters.","registration")
            is_valid=False
        if len(data['last_name'].strip())<2:
            flash("Last name must be at least 2 characters.","registration")
            is_valid=False
        if not re.fullmatch(regex_email, data['email']):
            flash("Invalid email.","registration")
            is_valid=False
        if User.get_one_by_email(data['email']):
            flash("Email is already in use.","registration")
            is_valid=False
        if  bool(re.search(r"\s", data['password'])): #checks if there are any spaces in 'password'
            flash("Password may not contain any spaces.","registration")
            is_valid=False
        if len(data['password'])<8:
            flash("Password must be at least 8 characters.","registration")
            is_valid=False
        if not data['password'] == data['confirm_password']:
            flash("Password does not match.","registration")
            is_valid=False
        return is_valid
from flask_app.config.mysqlconnection import connectToMySQL
from flask_app.models import user
from flask import flash

class Recipe:
    DB = "recipes"
    def __init__(self,data):
        self.id = data['id']
        self.name = data['name']
        self.description = data['description']
        self.instructions = data['instructions']
        self.date_cooked = data['date_cooked']
        self.under_30 = data['under_30']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.owner = None

    @classmethod
    def get_all(cls):
        query = """
                SELECT * FROM recipes
                LEFT JOIN users ON recipes.user_id = users.id;
                """
        results = connectToMySQL(cls.DB).query_db(query)
        recipe_list = []
        for row in results:
            recipe_list.append(row) # not doing objects now with AJAX
        return recipe_list
    
    @classmethod
    def get_one_by_id(cls,recipe_id):
        data = {
            'id' : recipe_id
        }
        query = """
                SELECT * FROM recipes
                LEFT JOIN users ON recipes.user_id = users.id
                WHERE recipes.id = %(id)s;
                """
        recipe_dict = connectToMySQL(cls.DB).query_db(query,data)[0]
        return recipe_dict
    
    @classmethod
    def save(cls,data):
        query = """
                INSERT INTO recipes (name,description,instructions,date_cooked,under_30,user_id)
                VALUES (%(name)s, %(description)s, %(instructions)s, %(date_cooked)s, %(under_30)s, %(user_id)s);
                """
        recipe_id = connectToMySQL(cls.DB).query_db(query,data)
        return recipe_id
    
    @classmethod
    def update(cls,data):
        query = """
                UPDATE recipes 
                SET name=%(name)s, description=%(description)s, instructions=%(instructions)s, date_cooked=%(date_cooked)s, under_30=%(under_30)s, user_id=%(user_id)s
                WHERE id=%(id)s;
                """
        results = connectToMySQL(cls.DB).query_db(query,data)
        return results
    
    @classmethod
    def delete(cls,recipe_id):
        data = {
            'id' : recipe_id
        }
        query = "DELETE FROM recipes WHERE id=%(id)s;"
        return connectToMySQL(cls.DB).query_db(query,data)
    
    # not needed in this implementation -> validations handled in js
    @staticmethod
    def recipe_is_valid(data):
        is_valid = True
        if len(data['name'].strip())<3:
            flash("Name is too short.")
            is_valid=False
        if len(data['description'].strip())<3:
            flash("Description is too short.")
            is_valid=False
        if len(data['instructions'].strip())<3:
            flash("Instructions are too short.")
            is_valid=False
        if 'under_30' not in data:
            flash("Please select prep time.")
            is_valid=False    
        if 'date_cooked' not in data or data['date_cooked']=='':
            flash("Please select a date for this recipe.")
            is_valid=False        
        return is_valid
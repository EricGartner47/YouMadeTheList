from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, DateTimeField, SubmitField
from wtforms.validators import DataRequired

class NewTask(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    notes = StringField('notes')
    due_date = DateTimeField('due_date')
    completed = BooleanField('completed')
    completed_date = DateTimeField('completed')
    # submit = SubmitField('Create_Task')
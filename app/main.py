from flask import Blueprint, render_template, request
from flask_login import login_required, current_user

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

# todo: change this
@main.route('/profile')
@login_required
def profile():
    return render_template('config.html', email=current_user.email)
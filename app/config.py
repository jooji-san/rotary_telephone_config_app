from flask_socketio import emit, leave_room, join_room, rooms
from . import socketio
from flask import render_template, Blueprint, request

config = Blueprint('config', __name__)
clients = {}


@config.route('/')
def index():
    return render_template('config.html')


@socketio.on('connection')
def handle_connect(email):
    clients[request.sid] = email
    matching_client_sid = next((client_sid for client_sid, client_email in clients.items(
    ) if client_email == email and client_sid != request.sid), None)
    if matching_client_sid:
        room_name = email
        join_room(room_name, sid=request.sid)
        join_room(room_name, sid=matching_client_sid)
        emit("joined", room=room_name)
        print(
            f'Clients with sid {request.sid} & {matching_client_sid} joined room {room_name}')
    print(clients)


@socketio.on('disconnect')
def handle_disconnect():
    print('A user has disconnected')
    del clients[request.sid]
    print(clients)


@socketio.on('current config')
def handle_current_config(json, email):
    emit('current config', json, to=email)


@socketio.on('updated config')
def handle_updated_config(json, email):
    emit('updated config', json, to=email)


@socketio.on('successful update')
def handle_successful_update(email):
    emit('successful update', to=email)

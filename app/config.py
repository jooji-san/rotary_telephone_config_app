from flask_socketio import emit, leave_room, join_room, rooms
from . import socketio
from flask import render_template, Blueprint, request

config = Blueprint('config', __name__)
clients = {}


@config.route('/')
def index():
    return render_template('config.html')


@socketio.on('connection')
def handle_connect(id):
    clients[request.sid] = id
    matching_client_sid = next((client_sid for client_sid, client_id in clients.items(
    ) if client_id == id and client_sid != request.sid), None)
    if matching_client_sid:
        room_name = id
        join_room(room_name, sid=request.sid)
        join_room(room_name, sid=matching_client_sid)
        emit("joined", room=room_name)
        print(
            f'Clients with sid {request.sid} & {matching_client_sid} joined room {room_name}')
    print(clients)


@socketio.on('disconnect')
def handle_disconnect():
    print('A user has disconnected')
    id = request.sid
    if id in clients:
        del clients[id]


@socketio.on('current config')
def handle_current_config(json):
    emit('current config', json, to=rooms()[1])

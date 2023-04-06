from flask_socketio import emit, leave_room, join_room
from . import socketio

@socketio.on('connect', namespace='/config')
def handle_connect():
    print('A user has connected')

@socketio.on('disconnect', namespace='/config')
def handle_disconnect():
    print('A user has disconnected')
    id = request.sid
    if id in clients:
        del clients[id]

@socketio.on('join', namespace='/config')
def handle_join(data):
    print('A user has joined')
    id = data['id']
    clients[request.sid] = id

    # Find other clients with the same ID
    matching_clients = [client_id for client_id, client in clients.items() if client == id and client_id != request.sid]

    # If there is a matching client, join them both to a room with the ID as the room name
    if len(matching_clients) > 0:
        room_name = id
        join_room(room_name, namespace='/config')
        for client_id in matching_clients:
            join_room(room_name, sid=client_id, namespace='/config')
        print(f'Clients with ID {room_name} joined room {room_name}')
import random
from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

socketIo = SocketIO(app, cors_allowed_origins="*")

# The list of type of players possible
playerTypes =['Knight', 'Archer', 'Slime']
# The list of players
players = {}


# The current connections to the server
connections = {}

@socketIo.on('connect')
def connect():
    global connections

    # Add the connection to the list of connections
    connections[request.sid] = {}

    emit('connected')


@socketIo.on('getPlayer')
def getPlayer(socketId):
    global playerTypes
    global connections

    # Get a random playerType from the list
    playerType = random.choice(playerTypes)

    # Add the playerType to the list of players
    if socketId in connections:
        connections[socketId] = {'type': playerType}
        print('player added to connections')
    
    print(connections)
    # Return the player to the client
    emit('player', playerType)

@socketIo.on('disconnect')
def disconnect():
    global players
    global playerTypes
    global connections

    # Remove the connection from the list of connections
    if request.sid in connections:
        del connections[request.sid]
        print('deleted ' + request.sid)

@socketIo.on('updatePlayer')
def updatePlayer(data):
    # Broadcast the player to all the clients
    socketIo.emit('updatePlayer', data, broadcast=True)


    

if __name__ == '__main__':
    socketIo.run(app)
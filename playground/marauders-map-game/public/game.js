export default function createGame() {
	const state = {
		players: {},
		fruits: {},
		screen: {
			width: 10,
			height: 10
		}
	};

	const observers = [];

	function setState(newState) {
		Object.assign(state, newState);
	}
	
	function subscribe(observerFunction){
		observers.push(observerFunction);
	}

	function notifyAll(command){
		for (const observerFunction of observers) {
			observerFunction(command);
		}
	}

	function start(){
		const frequency = 2000;

		setInterval(addFruit, frequency);
	}

	function addPlayer(command) {
		const playerId = command.playerId;
		const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
		const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);

		state.players[playerId] = {
			x: playerX,
			y: playerY
		};

		notifyAll({
			type: 'add-player',
			playerId,
			playerX,
			playerY
		});
	}

	function removePlayer(command){
		const playerId = command.playerId;

		delete state.players[playerId];

		notifyAll({
			type: 'remove-player',
			playerId
		});
	}

	function addFruit(command) {
		const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000);
		const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width);
		const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height);

		state.fruits[fruitId] = {
			x: fruitX,
			y: fruitY
		};

		notifyAll({
			type: 'add-fruit',
			fruitId,
			fruitX,
			fruitY
		});
	}

	function removeFruit(command){
		const fruitId = command.fruitId;

		delete state.fruits[fruitId];

		notifyAll({
			type: 'remove-fruit',
			fruitId
		});
	}

	function movePlayer(command) {
		console.log(`MovePlayer -> ${command.playerId} with ${command.keyPressed}`);
		notifyAll(command);

		const acceptedMoves = {
			ArrowUp: (player) => {
				if (player.y > 0){
					player.y -= 1;
				}              
			},
			ArrowDown: (player) => {
				if(player.y < state.screen.height - 1) {
					player.y += 1;
				}
			},
			ArrowLeft: (player) => {
				if(player.x > 0) {
					player.x -= 1;
				}
			},
			ArrowRight: (player) => {
				if(player.x < state.screen.width - 1) {
					player.x += 1;
				}
			}
		}

		const keyPressed = command.keyPressed;
		const player = state.players[command.playerId];
		const movePlayer = acceptedMoves[keyPressed];
		
		if (player && movePlayer) {
			movePlayer(player);
			checkFruitCollision(command.playerId);
		}
	}

	function checkFruitCollision(playerId) {
		const player = state.players[playerId];

		for (const fruitId in state.fruits) {
			const fruit = state.fruits[fruitId];

			if( player.x === fruit.x && player.y === fruit.y ) {
				console.log(`Collision of ${playerId} and ${fruitId}`);
				removeFruit({ fruitId });
			}
		}
	}

	return {
		addPlayer,
		removePlayer,
		addFruit,
		removeFruit,
		movePlayer,
		setState,
		state,
		subscribe,
		start
	};
}
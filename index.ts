#!/usr/bin/env node
import  inquirer from 'inquirer';


class Player {
    name: string;
    fuel: number;

    constructor(name: string) {
        this.name = name;
        this.fuel = 100; 
    }

    decreaseFuel() {
        this.fuel -= 25;
    }

    
    increaseFuel() {
        this.fuel = 100;
    }
}


class Opponent {
    name: string;
    fuel: number;

    constructor(name: string) {
        this.name = name;
        this.fuel = 100; 
    }

    
    decreaseFuel() {
        this.fuel -= 25;
    }
}


async function endGame(message: string) {
    console.log(message);
    const response = await inquirer.prompt<{playChoice: String;}>({
        type: "list",
        name: "playChoice",
        message: "Do you want to play again or exit?",
        choices: ['Play again', 'Exit']
    });
    if (response.playChoice === 'Play again') {
        startGame();
    } else {
        console.log('Thanks for playing! 👋');
        process.exit();
    }
}


async function startGame() {

    const playerNameResponse = await inquirer.prompt<{name: string}>({
        type: "input",
        name: "name",
        message: "Please enter your name:"
    });
    const playerName = playerNameResponse.name;
    const player = new Player(playerName);

    // Select opponent
    const opponentResponse = await inquirer.prompt({
        type: 'list',
        name: 'opponent',
        message: 'Select your opponent:',
        choices: ['💀 Skeleton', '😈 Venom', '🧟 Zombie']
    });
    const opponentName = opponentResponse.opponent.split(' ')[1];
    const opponent = new Opponent(opponentName);

    // Game loop
    while (true) {
        // Select action
        const actionResponse = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'Select your action:',
            choices: [' Attack', ' Drink Potion', 'Run for Your Life']
        });
        const action = actionResponse.action.split(' ')[1];

        // Perform action based on player's choice
        if (action === 'Attack') {
            // Calculate hit chance
            const hitChance = Math.random();
            if (hitChance > 0.2) { // Adjust hit chance as needed
                opponent.decreaseFuel();
                console.log(`${player.name} attacks ${opponent.name}!`);
                console.log(`${opponent.name}'s fuel level: ${opponent.fuel}`);
                if (opponent.fuel <= 0) {
                    endGame(`${opponent.name} defeated! ${player.name} wins! 🏆`);
                    break;
                }
            } else {
                console.log(`${player.name} misses the attack!❌ `);
            }
            player.decreaseFuel();
            console.log(`${player.name}'s fuel level: ${player.fuel}`);
        } else if (action === 'Drink') {
            player.increaseFuel();
            console.log(`${player.name} drinks a potion and restores fuel to 100. 🍷`);
        } else if (action === 'Run') {
            console.log(`${player.name} runs for their life! Game over. 🏃‍♂️`);
            endGame('Game over.');
            break;
        }

        // Check if player's fuel reaches 0
        if (player.fuel <= 0) {
            endGame(`${player.name}'s fuel level reaches 0! ${player.name} loses!⚰️ `);
            break;
        }
    }
}

// Start the game
startGame();
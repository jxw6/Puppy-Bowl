const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2308-ACC-PT-WEB-PT-B';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

const state = {
    players: [],
};

const newPlayerForm = document.getElementById('new-player-form');



/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL + 'players');
        const json = await response.json();
        return json.data.players;
        
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL + 'players/' + playerId)
        const json = await response.json();
        return json.data.player;

    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async () => {
    try {
        let playerObj = {};
        playerObj['name'] = document.getElementById('formName').value;
        playerObj['breed'] = document.getElementById('formBreed').value;
        playerObj['status'] = document.getElementById('formStatus').value;
        playerObj['imageUrl'] = document.getElementById('formImageUrl').value;
        playerObj['teamId'] = document.getElementById('formTeam').value;
        const response = await fetch(APIURL + 'players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playerObj),
        });
        const result = await response.json();
        console.log(result);
        state.players = await fetchAllPlayers();
        renderAllPlayers(state.players);

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL + 'players/' + playerId,
        {method: 'DELETE'});
        const result = await response.json();
        console.log(result);
        state.players = await fetchAllPlayers();
        renderAllPlayers(state.players);
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    const allPlayersContainer = document.getElementById('all-players-container');
    allPlayersContainer.innerHTML = '';
    try {
        playerList.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.classList.add(player.id);
            playerDiv.innerHTML = `
            Name: ${player.name}
            <br>Breed: ${player.breed}
            <br>Status: ${player.status}
            <br><image src='${player.imageUrl}'>
            <br>CreatedAt: ${player.createdAt}
            <br>UpdatedAt: ${player.updatedAt}
            <br>TeamId: ${player.teamId}
            <br>CohortId: ${player.cohortId}
            <button id='details-${player.id}' onclick='fetchPlayer(${player.id})'>See Details</button>
            <button id='remove-${player.id}' onclick='removePlayer(${player.id})'>Remove Player</button>`

            allPlayersContainer.appendChild(playerDiv);
        })
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const renderPlayer = (player) => {
    const allPlayersContainer = document.getElementById('all-players-container');
    allPlayersContainer.innerHTML = '';
    try {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add(player.id);
        playerDiv.innerHTML = `
            Name: ${player.name}
            <br>Breed: ${player.breed}
            <br>Status: ${player.status}
            <br><image src='${player.imageUrl}'>
            <br>CreatedAt: ${player.createdAt}
            <br>UpdatedAt: ${player.updatedAt}
            <br>TeamId: ${player.teamId}
            <br>CohortId: ${player.cohortId}
            <button id='details-${player.id}' onclick='window.location.reload()'>See All Players</button>
            <button id='remove-${player.id}' onclick='removePlayer(${player.id})'>Remove Player</button>`

        allPlayersContainer.appendChild(playerDiv);

        /**player.team.players.forEach(teamPlayer => {
            if (player.id == teamPlayer.id){
                return
            }
            const playerDiv = document.createElement('div');
            playerDiv.classList.add(teamPlayer.id);
            playerDiv.innerHTML = `
            Name: ${teamPlayer.name}
            <br>Breed: ${teamPlayer.breed}
            <br>Status: ${teamPlayer.status}
            <br><image src='${teamPlayer.imageUrl}'>
            <br>CreatedAt: ${teamPlayer.createdAt}
            <br>UpdatedAt: ${teamPlayer.updatedAt}
            <br>TeamId: ${teamPlayer.teamId}
            <br>CohortId: ${teamPlayer.cohortId}
            <button id='details-${teamPlayer.id}' onclick='fetchPlayer(${teamPlayer.id})'>See Details</button>
            <button id='remove-${teamPlayer.id}' onclick='removePlayer(${teamPlayer.id})'>Remove Player</button>`
            allPlayersContainer.appendChild(playerDiv);
        }) */
    } catch (err) {
        console.error('Uh oh, trouble rendering single player!', err);
    }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    
    try {
        var form = document.createElement("form");

        var formNameLabel = document.createElement("label")
        var formNameInput = document.createElement("input")

        formNameInput.id = "formName"
        formNameInput.type = "text"
        formNameInput.name = "name"

        formNameLabel.innerText = "Name:";

        var formBreedLabel = document.createElement("label")
        var formBreedInput = document.createElement("input")

        formBreedInput.setAttribute("id","formBreed");
        //formBreedLabel.appendChild(formBreedInput);
        formBreedLabel.innerText = "Breed:";
        
        var formStatusLabel = document.createElement("label")
        var formStatusInput = document.createElement("select")
        var option = document.createElement("option");
        option.value = "field";
        option.text = "field";
        formStatusInput.appendChild(option)
        var option2 = document.createElement("option");
        option2.value = "bench";
        option2.text = "bench";
        formStatusInput.appendChild(option2)

        formStatusInput.setAttribute("id","formStatus");
        //formStatusLabel.appendChild(formStatusInput);
        formStatusLabel.innerText = "Status:";

        var formImageUrlLabel = document.createElement("label")
        var formImageUrlInput = document.createElement("input")

        formImageUrlInput.setAttribute("id","formImageUrl");
        //formImageUrlLabel.appendChild(formImageUrlInput);
        formImageUrlLabel.innerText = "ImageUrl:";

        var formTeamLabel = document.createElement("label")
        var formTeamInput = document.createElement("input")

        formTeamInput.setAttribute("id","formTeam");
        //formTeamLabel.appendChild(formTeamInput);
        formTeamLabel.innerText = "TeamID:";

        var button = document.createElement("button");
        button.setAttribute("type", "button");
        button.addEventListener("click", addNewPlayer);
        button.innerText = "Add Player";
        
        form.appendChild(formNameLabel);
        form.appendChild(formNameInput);
        form.appendChild(formBreedLabel);
        form.appendChild(formBreedInput);
        form.appendChild(formStatusLabel);
        form.appendChild(formStatusInput);
        form.appendChild(formImageUrlLabel);
        form.appendChild(formImageUrlInput);
        form.appendChild(formTeamLabel);
        form.appendChild(formTeamInput);
        form.appendChild(button);
        newPlayerForm.appendChild(form);

    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
}

const fetchPlayer = async (playerId) => {
    const singlePlayer = await fetchSinglePlayer(playerId);
    renderPlayer(singlePlayer);
}
init();
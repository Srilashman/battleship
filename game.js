
let opponent_shoot = new Set();
let opponent_sq = new Set();
let opp_ship_positions = [];
let opp_ship_hit = [5, 4, 3, 3, 2];
let player_ship_hit = [5, 4, 3, 3, 2];
let opp_shipPositionMap = new Map();
let player_shipPositionMap = new Map();
let used_circles = new Set();
let player_cnt = 5;
let opp_cnt = 5;
let board_size = 10;
let shot_cnt = 0;
let shuffled_sq = [];
let isWon = false;
for(let i = 0; i < 100; i++){
    shuffled_sq.push(i);
}
shuffled_sq = shuffle(shuffled_sq)
function shuffle(cards_values){
    // uses Fisher–Yates shuffle algorithm
    for(let i = cards_values.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        [cards_values[j], cards_values[i]] = [cards_values[i], cards_values[j]]; //swapping values
    }
    return cards_values;
}

document.addEventListener("DOMContentLoaded", function() {
    const used = JSON.parse(localStorage.getItem('used'));
    console.log(used);
    const urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get("name");
    if(!name_check(name)){
        name = "guest";
    }
    function name_check(name){
        if(name === null) return false;
        for(let i = 0; i < name.length; i++){
            if(name[i] !== ' ') return true; //name is not just spaces
        }
        return false; //name is just spaces
    }
    console.log(name);
    const player_board = document.getElementById("player-board");
    const opponent_board = document.getElementById("opponent-board");
    const player = document.getElementById("player-name");
    const place_boats_msg  = document.createElement("div");
    place_boats_msg.classList.add("place_boats_msg");
    place_boats_msg.textContent = name.toUpperCase();
    let history = []
    const restart_button = document.getElementById("restart");
    restart_button.addEventListener("click", function() {
        let ret = confirm("Are you sure you want to restart?")
        if(ret){
            window.location.href = "placings.html?name=" + name;
        }
    });
    Object.values(used).forEach(arr => {
        arr.forEach(j => {
            if(typeof j !== "boolean"){
                history.push(j);
            }
        });
    });
    player.appendChild(place_boats_msg);
    for(let i = 0; i < 100; i++){
        const square = document.createElement("div");
        square.id = `square${i}`;
        square.classList.add("player-square");
        square.classList.add("not-allowed");
        player_board.appendChild(square);
        history.forEach(j => {
            if(i === j){
                const high_sq = document.getElementById(`square${i}`);
                high_sq.classList.add("locked");
            }
        });
    }
    let a = 0;
    Object.values(used).forEach(arr => {
        let min_index = 101;
        let max_index = -1;
        arr.forEach(sq => {
                if(typeof sq !== "boolean"){
                if(sq < min_index){
                    min_index = sq;
                }
                if(sq > max_index){
                    max_index = sq;
                }
            }
        });
        const min_sq = document.getElementById(`square${min_index}`);
        const max_sq = document.getElementById(`square${max_index}`);
        if(arr[arr.length - 1]){
            min_sq.classList.add("top-sq");
            max_sq.classList.add("bot-sq");
        }
        else{
            min_sq.classList.add("left-sq");
            max_sq.classList.add("right-sq");
        }
        for(let i = 0; i < arr.length; i++){
            if(typeof arr[i] !== "boolean") player_shipPositionMap.set(arr[i], a);
        }
        a++;
    });
    console.log(player_shipPositionMap);
    for(let i = 100; i < 200; i++){
        const square = document.createElement("div");
        square.id = `square${i}`;
        square.classList.add("opponent-square");
        opponent_board.appendChild(square);
        const circle = document.createElement("div");
        circle.classList.add("circle");
        square.addEventListener("click", function() {
            if(used_circles.has(i)) return;
            square.appendChild(circle);
            square.classList.add("not-allowed");
            square.classList.add("selected");
            const logContainer = document.getElementById("log-container");
            const newLog = document.createElement("div");
            newLog.classList.add("log-item");
            used_circles.add(i);
            if(opp_shipPositionMap.has(i)){
                const shipIndex = opp_shipPositionMap.get(i);
                opp_ship_hit[shipIndex]--;
                circle.style.backgroundColor = "red";
                newLog.textContent = "you hit a ship";
                logContainer.appendChild(newLog);
                
                if(opp_ship_hit[shipIndex] === 0){
                    player_cnt--;
                    const logContainer = document.getElementById("log-container");
                    const newLog = document.createElement("div");
                    newLog.textContent = "you sunk a ship";
                    newLog.classList.add("log-item");
                    logContainer.appendChild(newLog);
                    revealShip(shipIndex);
                    if(player_cnt === 0){
                        alert("You win!!!!!");
                        const logContainer = document.getElementById("log-container");
                        const newLog = document.createElement("div");
                        newLog.textContent = "you win!!!!";
                        newLog.classList.add("log-item");
                        logContainer.appendChild(newLog);
                        for(let n = 100; n < 200; n++){
                            used_circles.add(n);
                        }
                        isWon = true;
                    }
                }
            } else{
                newLog.textContent = "missed";
                logContainer.appendChild(newLog);
            }
            logContainer.scrollTop = logContainer.scrollHeight;
            if(!isWon) opponent_random_shoot();
        });
    }
    random_board();
    /*opponent_sq.forEach(i => {
        const sq = document.getElementById(`square${i}`);
        sq.classList.add("locked");
    });*/
    function random_board() {
        opp_ship_positions.push(place_ship(5));  // Place the 5-square ship
        opp_ship_positions.push(place_ship(4));  // Place the 4-square ship
        opp_ship_positions.push(place_ship(3));  // Place the first 3-square ship
        opp_ship_positions.push(place_ship(3));  // Place the second 3-square ship
        opp_ship_positions.push(place_ship(2));  // Place the 2-square ship
        console.log(opp_ship_positions);
        for(let a = 0; a < opp_ship_positions.length; a++){
            for(let j = 0; j < opp_ship_positions[a].length; j++){
                opp_shipPositionMap.set(opp_ship_positions[a][j], a); // Key is the square, value is the ship index
            }
        }
    }
    
    function place_ship(ship_length) {
        let placed = false;
        let positions = [];
        while (!placed) {
            let isVert = Math.floor(Math.random() * 2);  // 0 for horizontal, 1 for vertical
            let index = Math.floor(Math.random() * 100) + 100;
    
            // Calculate valid positions for the ship
            positions = [];
            if (isVert) {
                // Vertical placement
                if (index + (ship_length - 1) * board_size < 200) {
                    for (let i = 0; i < ship_length; i++) {
                        positions.push(index + i * board_size);
                    }
                }
            } else {
                // Horizontal placement, ensuring it doesn't cross row boundaries
                if ((index % board_size) + ship_length <= board_size) {
                    for (let i = 0; i < ship_length; i++) {
                        positions.push(index + i);
                    }
                }
            }
    
            // Check for conflicts
            if (positions.length === ship_length && !conflicts(positions)) {
                positions.forEach(i => opponent_sq.add(i));  // Add ship positions to the board
                placed = true;
            }
        }
        return positions;
    }
    
    function conflicts(positions) {
        // Check if any of the positions conflict with existing ships
        return positions.some(i => opponent_sq.has(i));
    }
    function opponent_random_shoot(){
        let n = shuffled_sq[shot_cnt];
        shot_cnt++;
        const shoot_sq = document.getElementById(`square${n}`);
        const circle = document.createElement("div");
        circle.classList.add("circle");
        if(player_shipPositionMap.has(n)){
            circle.style.backgroundColor = "red";
            const shipIndex = player_shipPositionMap.get(n);
            const logContainer = document.getElementById("log-container");
            const newLog = document.createElement("div");
            newLog.textContent = "opponent hit your ship";
            newLog.classList.add("log-item");
            logContainer.appendChild(newLog);
            player_ship_hit[shipIndex]--;
            if(player_ship_hit[shipIndex] === 0){
                const logContainer = document.getElementById("log-container");
                const newLog = document.createElement("div");
                newLog.textContent = "opponent sunk your ship";
                newLog.classList.add("log-item");
                logContainer.appendChild(newLog);
                opp_cnt--;
                if(opp_cnt === 0){
                    alert("u lose :(");
                    const logContainer = document.getElementById("log-container");
                    const newLog = document.createElement("div");
                    newLog.textContent = "u lose :(";
                    newLog.classList.add("log-item");
                    logContainer.appendChild(newLog);
                    for(let n = 100; n < 200; n++){
                        used_circles.add(n);
                    }
                }
            }
        }
        else{
            const logContainer = document.getElementById("log-container");
            const newLog = document.createElement("div");
            newLog.textContent = "opponent missed";
            newLog.classList.add("log-item");
            logContainer.appendChild(newLog);
        }
        shoot_sq.appendChild(circle);
    }
    function revealShip(n){
        let arr = [];
        let min_key = 201;
        let max_key = 99;
        for (const [key, value] of opp_shipPositionMap){
            if(value === n){
                arr.push(key);
                if(key > max_key){
                    max_key = key;
                }
                if(key < min_key){
                    min_key = key;
                }
            }
        }
        arr.forEach(n => {
            const sq_show = document.getElementById(`square${n}`);
            sq_show.classList.add("locked")
            sq_show.classList.remove("selected")
        });
        const min_sq = document.getElementById(`square${min_key}`);
        const max_sq = document.getElementById(`square${max_key}`);
        //check if vert
        let maxDiff = arr[0] - arr[arr.length - 1];
        if(maxDiff < 0){
            maxDiff = -maxDiff;
        }
        // is vert
        if(maxDiff % 10 === 0){
            min_sq.classList.add("top-sq");
            max_sq.classList.add("bot-sq");
        }
        // is not vert
        else{
            min_sq.classList.add("left-sq");
            max_sq.classList.add("right-sq");
        }

    }
});
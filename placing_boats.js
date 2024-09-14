let repeat = 1;
let num = 5;
let used = {"Aircraft carrier": [], "Battleship": [], "Destroyer": [], "Submarine": [], "Cruiser": []};
let isVert = false;
let lockedSquares = new Set(); // Track all locked squares
let isflipped = false;
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get("name");
    if(!name_check(name)){
        name = "guest";
    }
    function name_check(name){
        if(name === null) return false;
        for(let i = 0; i < name.length; i++){
            if(name[i] !== ' ') return true; //name does not have spaces
        }
        return false; //name is just spaces
    }
    const place_boats = document.getElementById("place-boats");
    const place_boats_msg  = document.createElement("div");
    place_boats_msg.classList.add("place_boats_msg");
    place_boats_msg.textContent = name.toUpperCase() + ", PLACE YOUR BOATS";
    place_boats.appendChild(place_boats_msg);
    const board = document.getElementById("board-container");
    const rotate = document.getElementById("rotate-button");
    rotate.addEventListener("click", function() {
        isVert = !isVert;
    });
    for(let i = 0; i < 100; i++){
        const square = document.createElement("div");
        square.id = `square${i}`;
        square.classList.add("square");
        board.appendChild(square);
        square.addEventListener("mouseenter", function() {
            let squares = decode_adj_sq(i);
            let isNotAllowed = squares.some(sq => lockedSquares.has(sq));
            if (!isNotAllowed) {
                squares.forEach(sq => {
                    const high_sq = document.getElementById(`square${sq}`);
                    high_sq.classList.remove("not-allowed");
                });
                highlightboat(i, true);
            } else {
                squares.forEach(sq => {
                    const high_sq = document.getElementById(`square${sq}`);
                    high_sq.classList.add("not-allowed");
                });
            }
        });

        square.addEventListener("mouseleave", function() {
            highlightboat(i, false);
        });

        square.addEventListener("click", function() {
            let squares = decode_adj_sq(i);
            if(!squares.some(sq => lockedSquares.has(sq))) {
                placeBoat(i);
                num--;
                if(num === 2 && repeat === 1){
                    num++;
                    repeat = 0;
                }
                if(num === 1){
                    localStorage.setItem('used', JSON.stringify(used));
                    window.location.href = "interface.html?name=" + name;
                }
            }
        });
    }

    function highlightboat(i, highlight){
        let squares = decode_adj_sq(i);
        squares.forEach(sq => {
            if(!lockedSquares.has(sq)) {
                const high_sq = document.getElementById(`square${sq}`);
                if (highlight) {
                    high_sq.classList.add("gray");
                } else {
                    high_sq.classList.remove("gray");
                }
            }
        });
    }

    function placeBoat(i) {
        let squares = decode_adj_sq(i);
        let min_index = 101;
        let max_index = -1;
        squares.forEach(sq => {
            if(sq < min_index){
                min_index = sq;
            }
            if(sq > max_index){
                max_index = sq;
            }
        });
        const min_sq = document.getElementById(`square${min_index}`);
        const max_sq = document.getElementById(`square${max_index}`);
        if(isVert){
            min_sq.classList.add("top-sq");
            max_sq.classList.add("bot-sq");
        }
        else{
            min_sq.classList.add("left-sq");
            max_sq.classList.add("right-sq");
        }
        squares.forEach(sq => {
            const high_sq = document.getElementById(`square${sq}`);
            high_sq.classList.add("locked");
            lockedSquares.add(sq); // Mark square as locked
            add_used_index(sq);
        });
        add_used_index(isVert);
    }

    function decode_adj_sq(i){
        let squares = [];
        if(!isVert){
            switch(num){
                case 5:
                    squares = [i - 2, i - 1, i + 1, i + 2];
                    if(i % 10 < 2 || i % 10 > 7) {
                        switch (i % 10) {
                            case 0:
                                squares = [i + 1, i + 2, i + 3, i + 4];
                                break;
                            case 1:
                                squares = [i - 1, i + 1, i + 2, i + 3];
                                break;
                            case 8:
                                squares = [i - 3, i - 2, i - 1, i + 1];
                                break;
                            case 9:
                                squares = [i - 4, i - 3, i - 2, i - 1];
                                break;
                            default:
                                console.log("unexpected");
                        }
                    }
                    break;
                case 4:
                    squares = [i - 1, i + 1, i + 2];
                    if(i % 10 < 2 || i % 10 > 7) {
                        switch (i % 10) {
                            case 0:
                                squares = [i + 1, i + 2, i + 3];
                                break;
                            case 8:
                                squares = [i - 2, i - 1, i + 1];
                                break;
                            case 9:
                                squares = [i - 3, i - 2, i - 1];
                                break;
                            default:
                                console.log("unexpected");
                        }
                    }
                    break;
                case 3:
                    squares = [i - 1, i + 1];
                    if(i % 10 < 2 || i % 10 > 7) {
                        switch (i % 10) {
                            case 0:
                                squares = [i + 1, i + 2];
                                break;
                            case 9:
                                squares = [i - 2, i - 1];
                                break;
                            default:
                                console.log("unexpected");
                        }
                    }
                    break;
                case 2:
                    squares = [i + 1];
                    if(i % 10 < 2 || i % 10 > 7) {
                        switch (i % 10) {
                            case 9:
                                squares = [i - 1];
                                break;
                            default:
                                console.log("unexpected");
                        }
                    }
                    break;
                default:
                    console.log("not expected");
            }
    }
    else{
        switch(num){
            case 5:
                squares = [i - 20, i - 10, i + 10, i + 20];
                if(Math.floor(i / 10) < 2 || Math.floor(i / 10) > 7) {
                    switch (Math.floor(i/10)) {
                        case 0:
                            squares = [i + 10, i + 20, i + 30, i + 40];
                            break;
                        case 1:
                            squares = [i - 10, i + 10, i + 20, i + 30];
                            break;
                        case 8:
                            squares = [i - 30, i - 20, i - 10, i + 10];
                            break;
                        case 9:
                            squares = [i - 40, i - 30, i - 20, i - 10];
                            break;
                        default:
                            console.log("unexpected");
                    }
                }
                break;
            case 4:
                squares = [i - 10, i + 10, i + 20];
                if(Math.floor(i / 10) < 2 || Math.floor(i / 10) > 7) {
                    switch (Math.floor(i / 10)) {
                        case 0:
                            squares = [i + 10, i + 20, i + 30];
                            break;
                        case 8:
                            squares = [i - 20, i - 10, i + 10];
                            break;
                        case 9:
                            squares = [i - 30, i - 20, i - 10];
                            break;
                        default:
                            console.log("unexpected");
                    }
                }
                break;
            case 3:
                squares = [i - 10, i + 10];
                if(Math.floor(i / 10) < 2 || Math.floor(i / 10) > 7) {
                    switch (Math.floor(i / 10)) {
                        case 0:
                            squares = [i + 10, i + 20];
                            break;
                        case 9:
                            squares = [i - 20, i - 10];
                            break;
                        default:
                            console.log("unexpected");
                    }
                }
                break;
            case 2:
                squares = [i + 10];
                if(Math.floor(i / 10) < 2 || Math.floor(i / 10) > 7) {
                    switch (Math.floor(i / 10)) {
                        case 9:
                            squares = [i - 10];
                            break;
                        default:
                            console.log("unexpected");
                    }
                }
                break;
            default:
                console.log("not expected");
        }
    }
        return squares.concat(i);
    
    }

    function add_used_index(i){
        switch(num){
            case 5:
                used["Aircraft carrier"].push(i);
                break;
            case 4:
                used["Battleship"].push(i);
                break;
            case 3:
                if(repeat === 1){
                    used["Destroyer"].push(i);
                }
                else{
                    used["Submarine"].push(i);
                }
                break;
            case 2:
                used["Cruiser"].push(i);
                break;
            default:
                break;
        }
        console.log(used)
    }
    const display_name_container = document.getElementById("name-display");
    display_name_container.textContent = name.length >= 15 ? name.slice(0, 12) + "..." : name;
    const arrow = document.getElementById("down-arrow");
    const change_name = document.getElementById("change-name-container");
    change_name.classList.add("hidden-content");
    const pop_up_change_name = document.getElementById("change-name-msg");
    pop_up_change_name.classList.add("hidden-content");
    const overlay = document.getElementById("overlay");
    const close_popup = document.getElementById("change-name-cancel");
    const confirm_popup = document.getElementById("change-name-submit");
    arrow.addEventListener("click", function(){
        if(!isflipped){
            arrow.classList.add("pressed");
            change_name.classList.add("flipped");
            change_name.classList.remove("hidden-content");
            isflipped = true;
        }
        else{
            arrow.classList.remove("pressed");
            change_name.classList.remove("flipped");
            change_name.classList.add("hidden-content");
            isflipped = false;
        }
    });
    change_name.addEventListener("click", function() {
        pop_up_change_name.classList.remove("hidden-content");
        overlay.style.display = "block";
        pop_up_change_name.classList.add("show-content");
    });

    close_popup.addEventListener("click", function() {
        pop_up_change_name.classList.add("hidden-content");
        (document.getElementById("change-name")).value = null;
        overlay.style.display = "none";
        pop_up_change_name.style.display = "none";
    });

    confirm_popup.addEventListener("click", function() {
        const new_name = (document.getElementById("change-name")).value;
        if(new_name.length === 0){
            alert("Please enter a name");
            return;
        }
        if(!name_check(new_name)){
            alert("Please enter a valid name");
            return;
        }
        name = new_name;
        display_name_container.textContent = name.length >= 15 ? name.slice(0, 12) + "..." : name;
        pop_up_change_name.classList.add("hidden-content");
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('name', name);
        window.history.replaceState(null, '', newUrl);
        place_boats_msg.textContent = name.toUpperCase() + ", PLACE YOUR BOATS";
        overlay.style.display = "none";
        pop_up_change_name.style.display = "none";
    });

    overlay.addEventListener("click", function() {
        pop_up_change_name.classList.add("hidden-content");
        overlay.style.display = "none";
        pop_up_change_name.style.display = "none";
    });
});

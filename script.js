document.addEventListener("DOMContentLoaded", function() {
    const enter_button = document.getElementById("enter-name");
    const input = document.getElementById("name");
    const error = document.getElementById("error-msg-container");

    enter_button.addEventListener("click", function() {
        if (input.value.length === 0) {
            error.textContent = "NAME REQUIRED";
            error.style.display = "block"; // Show error message if input is empty
        } else if(!name_check(input.value)) {
            error.textContent = "NAME CANNOT BE EMPTY";
            error.style.display = "block";
        }
        else {
            error.style.display = "none";  // Hide error message if input is not empty
            window.location.href = "placings.html?name=" + input.value;
        }
    });
    addEventListener("keydown", (event) => {
        if(event.key === "Enter"){
            if (input.value.length === 0) {
                error.style.display = "block"; // Show error message if input is empty
            } else {
                error.style.display = "none";  // Hide error message if input is not empty
                window.location.href = "placings.html?name=" + input.value;
            }
        }
    });
    function name_check(name){
        for(let i = 0; i < name.length; i++){
            if(name[i] !== ' ') return true; //name does not have spaces
        }
        return false; //name is just spaces
    }
});
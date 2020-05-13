function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) throw "ERROR: Divide by Zero";
    return a / b;
}

function operate(a, b, operator) {
    a = Number(a);
    b = Number(b);
    if (operator === "+") return add(a, b);
    if (operator === "-") return subtract(a, b);
    if (operator === "*") return multiply(a, b);
    if (operator === "/") return divide(a, b);
    return "ERROR: No Valid Operator";
}

let display_value = [];

let num_keys = Array.from(document.querySelectorAll(".num-keys"));
let operator_keys = Array.from(document.querySelectorAll(".operator-keys"));
let clear_key = document.querySelector("#clear-key");
let equals_key = document.querySelector("#equals-key");
let display_num = document.querySelector(".display div");
let all_keys = Array.from(document.querySelectorAll(".keypad-container button"));

let theme_button = document.querySelector("#theme-button");
let body = document.body;
theme_button.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (theme_button.innerHTML === "dark") {
        theme_button.innerHTML = "light";
    } else {
        theme_button.innerHTML = "dark";
    }
});

operator_keys.forEach(key => key.classList.add('hidden'));
operator_keys.forEach(key => key.removeEventListener("click", operator_listener));

num_keys.forEach(key => key.addEventListener("click", num_listener));


function num_listener() {

    // groups neighboring numbers into the same array index
    if (!isNaN(display_value[display_value.length-1])) {
        display_value[display_value.length-1] += event.target.innerHTML;
    } else {
        display_value.push(event.target.innerHTML);
    }
    console.log(display_value.toString());


    operator_keys.forEach(key => key.classList.remove('hidden'));
    operator_keys.forEach(key => key.addEventListener("click", operator_listener));
    equals_key.classList.remove('hidden');
    equals_key.addEventListener("click", equals_listener);
    render();
}

function operator_listener() {
    display_value.push(" " + event.target.innerHTML + " ");

    num_keys.forEach(key => key.classList.remove('hidden'));
    num_keys.forEach(key => key.addEventListener("click", num_listener));

    render();

    operator_keys.forEach(key => key.classList.add('hidden'));
    operator_keys.forEach(key => key.removeEventListener("click", operator_listener));
    equals_key.classList.add('hidden');
    equals_key.removeEventListener("click", equals_listener);
}

clear_key.addEventListener("click", clear_listener);

function clear_listener() {
    all_keys.forEach(key => key.classList.remove('hidden'));
    operator_keys.forEach(key => key.addEventListener("click", operator_listener));
    num_keys.forEach(key => key.addEventListener("click", num_listener));
    
    display_value.pop();
    render();
}

equals_key.addEventListener("click", equals_listener);

function equals_listener() {
    try {
        compute();
        render();
        num_keys.forEach(key => key.classList.add('hidden'));
        num_keys.forEach(key => key.removeEventListener("click", num_listener));
    } catch (err) {
        display_value = [err];
        render("ERROR");
        display_value = [""];
    }
}

function render(type) {
    if (type === "ERROR") {
        display_num.classList.add('error');
        operator_keys.forEach(key => key.classList.add('hidden'));
        operator_keys.forEach(key => key.removeEventListener("click", operator_listener));
        equals_key.classList.add('hidden');
        equals_key.removeEventListener("click", equals_listener);
    } else {
        display_num.classList.remove('error');
    }

    if (display_value.join("").length > 50) {
        operator_keys.forEach(key => key.classList.add('hidden'));
        operator_keys.forEach(key => key.removeEventListener("click", operator_listener));
        num_keys.forEach(key => key.classList.add('hidden'));
        num_keys.forEach(key => key.removeEventListener("click", num_listener));
    }

    display_num.innerHTML = display_value.join("");
    console.log(display_num.innerHTML);
    
    // if no value is currently displayed, insert a space to preserve the spacing
    if (display_num.innerHTML === "") {
        display_num.innerHTML = "&nbsp";
        operator_keys.forEach(key => key.classList.add('hidden'));
        operator_keys.forEach(key => key.removeEventListener("click", operator_listener));
    }
}


/* PRECONDITIONS: expression must start and end with a number
*                 there cannot be 2 operators in sequence
*/
function compute() {

    // removes whitespace from operator values
    let compute_num = display_value.map(x => {
        x = x.toString();
        return x.trim()
    });


    console.log("compute_num (before operation)" + compute_num.toString());


    // starts from index 1 (the first operator)
    for (let i = 1; i < compute_num.length; i+=0) {

        if (compute_num[i] === "/" || compute_num[i] === "*") {
            compute_num[i] = operate(compute_num[i-1], compute_num[i+1], compute_num[i]);
            compute_num.splice(i-1, 1);
            compute_num.splice(i, 1);
        } else {
            // skips to the next operator
            i += 2;
        }
    }

    console.log("compute_num (after level 1)" + compute_num.toString());

    for (let i = 1; i < compute_num.length; i+=0) {
        if (compute_num[i] === "+" || compute_num[i] === "-") {
            compute_num[i] = operate(compute_num[i-1], compute_num[i+1], compute_num[i]);
            compute_num.splice(i-1, 1);
            compute_num.splice(i, 1);
        } else {
            // skips to the next operator
            i += 2;
        }
    }

    console.log("compute_num (after level 2)" + compute_num.toString());
    display_value = compute_num;


}
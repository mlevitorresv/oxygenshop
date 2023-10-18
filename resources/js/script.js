let scroller = document.getElementById("scroller");
let burgerMenu = document.getElementById("burgerMenu");
let menu = document.getElementById("headerList");
let menuOpen = false;
let btGoTop = document.getElementById("goTop");
let inputName = document.getElementById("name");
let inputEmail = document.getElementById("email");
let inputCheck = document.getElementById("consent-check");
let dataSend = document.getElementById("dataSend");
let modal = document.getElementById("modal");
let btCloseModal = document.getElementById("modalClose");
let modalEmail = document.getElementById("modalEmail");
let btModalSend = document.getElementById("modalSend");
let modalContent = document.getElementById("modalContent");
let coinSelect = document.getElementById("coinSelect");
let offerPrice = document.getElementsByClassName("offer__price");


let posScroll;
let bodyHeight;
let windowHeight;
const urlPOST = 'https://jsonplaceholder.typicode.com/posts';
let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let urlcoinGET = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json';
let prices = [];


//burgerMenu
const handleMenu = ()=>{
    if(!menuOpen){
        menu.style.display = "block";
        menuOpen = true;
    }else{
        menu.style.display = "none";
        menuOpen = false;
    }
}


//percentage scroller
const showPercentageScroll = () =>{
    //PX DE ALTURA DEL BODY
    bodyHeight = document.body.scrollHeight;
    //PX DE ALTURA DE LA VENTANA
    windowHeight = window.innerHeight;

    //% QUE HEMOS BAJADO
    posScroll = Math.round(window.scrollY / (bodyHeight - windowHeight) *100);
    scroller.style.width = posScroll + "%";
}

//RETURN TO THE TOP
const goTop = ()=>{
    setTimeout(window.scrollTo(0, 0), 200);
}

//DATA VERIFICATION
const validName = () => {
    if(inputName.value.length < 2 || inputName.value.length > 100 ){
        inputName.style.borderColor = "red";
        return false;
    }else{
        inputName.style.borderColor = "grey";
        return true;
    }
}

const validEmail = (e) => {
    if(!emailRegex.test(e.value) ){
        e.style.borderColor = "red";
        return false;
    }else{
        e.style.borderColor = "grey";
        return true;
    }
}

//DATA SEND
const sendData = () => {
    if(!validName){
        inputName.style.borderColor = "red";
    }else if(!validEmail(inputEmail)){
        inputEmail.style.borderColor = "red";
    }else if(!inputCheck.checked){
        inputCheck.style.borderColor = "red";
    }else{
        fetch(urlPOST, {
            method: 'POST',
            body: JSON.stringify({
                name: inputName.value,
                email: inputEmail.value,
            }),
            headers:{
                'Content-type': 'application/json; charset=UTF-8'
            },
        })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));
    }
    
}


//POPUP SUSCRIBE
const showModal = () => {
    setTimeout(() =>{
        openModal();
    }, 5000)
}

const openScrollModal = () => {
    //PX DE ALTURA DEL BODY
    bodyHeight = document.body.scrollHeight;
    //PX DE ALTURA DE LA VENTANA
    windowHeight = window.innerHeight;

    //% QUE HEMOS BAJADO
    posScroll = Math.round(window.scrollY / (bodyHeight - windowHeight) *100);

    if(posScroll == 25){
        openModal();
    }
}

const openModal = () => {
    if(sessionStorage.getItem("closed") !== "true"){
        modal.style.display= "block";
    }
}

const outOfModal = (event) => {
    const position = modalContent.getBoundingClientRect();
    if(
        event.clientX < position.left || event.clientX > position.right ||
        event.clientY < position.top || event.clientY > position.bottom
    ){
        closeModal();
    }
}

const keyCloseModal = (event) => {
    if(event.keyCode == 27){
        closeModal();
    }
}

const closeModal = () =>{
    modal.style.display= "none";
    sessionStorage.setItem("closed", "true");
}

const sendModal = () => {
    if(validEmail(modalEmail)){
        fetch(urlPOST, {
            method: 'POST',
            body: JSON.stringify({
                email: modalEmail.value,
            }),
            headers:{
                'Content-type': 'application/json; charset=UTF-8'
            },
        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            modalEmail.value = "Email send";
            modalEmail.style.textAlign = "center";

        })
        .catch(err => {
            console.log(err);
            modalEmail.value = "An error was ocurred";
            modalEmail.style.textAlign = "center";

        });
    }

    
}

const getPrices = () =>{
    for(let i = 0; i < offerPrice.length; i++){
        const e = offerPrice[i];
        const price = e.textContent.slice(1)
        prices.push(price);
    }
    return prices;
}

const convertCoin = (c) => {
    let simb;
    if(c === "eur")simb = "€";
    else if(c === "usd") simb = "$"
    else if(c === "gbp") simb = "£"

    fetch(urlcoinGET)
    .then( response => response.json())
    .then(json => {
        const usd = json.usd;
        let convert;
        for (const e in usd) {
           if(usd.hasOwnProperty(e)){
                if(e === c){
                    getPrices();
                    for(let i = 0; i < offerPrice.length; i++){
                        convert = prices[i] * usd[e];
                        offerPrice[i].innerText =  simb +""+Math.round(convert);
                    }
                }
           }
        }
    });
};





burgerMenu.onclick = handleMenu;
window.onscroll = showPercentageScroll;
window.onscroll = openScrollModal;;
btGoTop.onclick = goTop;
inputName.oninput = validName;
inputEmail.oninput = validEmail;
dataSend.onclick = sendData;
window.onload = showModal;
btCloseModal.onclick = closeModal;
modal.onclick = outOfModal;
btModalSend.onclick = sendModal;
document.onkeydown = keyCloseModal;
coinSelect.onchange = () => {
    convertCoin(coinSelect.value);
}
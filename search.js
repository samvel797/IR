async function sendRequest (url, method, body = null) {
   
    const response = await fetch(url, {
        headers: {'Content-type': 'application/json'},
        method: method, 
        body: body
    })

    let serverResponse
    if (response.ok) {
        serverResponse = await response.json();
    }
    else {
        console.log("Ошибка HTTP: " + response.status);
    }

return serverResponse   
}



document.body.onload = searchOnload()

let responseUsers
let userCard = []
let img_info = []
let account_img = []
let info = []
let name_surname = []
let born_die = []
let i = 0 
async function searchOnload() {
    if (localStorage.getItem('id') == null) {
        console.log(document.querySelectorAll('.nav__link')[3])
        document.querySelectorAll('.nav__link')[3].innerHTML = "main"
        document.querySelectorAll('.nav__link')[0].href = "http://localhost:3000/register.html"
        document.querySelectorAll('.nav__link')[1].href = "http://localhost:3000/register.html"
        document.querySelectorAll('.nav__link')[0].innerHTML = "login"
        document.querySelectorAll('.nav__link')[1].innerHTML = "register"
    }
    let body = {
        reqnumber: 7,
    }
    body = JSON.stringify(body)
    console.log(body);
    serverResponse = await sendRequest('http://localhost:3000/index.html', 'POST', body)
    console.log("Произошла отправка данных ответ сервера = ", serverResponse)
    responseUsers = serverResponse
 
    responseUsers.forEach(element => {
        showUserCard(element.id)
        i++
    });
    
}
function openAccount () {
    console.log(this.id)
    window.location.href = 'http://localhost:3000/account.html'
    localStorage.setItem('anotherId', this.id)
}

function aliveCheck (die) {
    if (die == "1000-07-07") {
        die = "STILL ALIVE"
    }
    return die
}

function logout() {
    localStorage.clear()
    window.location = 'http://localhost:3000/index.html'
}

function showUserCard(id) {
    userCard[i] = document.createElement('div')
    img_info[i] = document.createElement('div')
    account_img[i] = document.createElement('img')
    info[i] = document.createElement('div')
    name_surname[i] = document.createElement('div')
    born_die[i] = document.createElement('div')
    userCard[i].className = ("userCard")
    userCard[i].id = (id)
    img_info[i].className = ("img_info")
    account_img[i].className = ("account_img")
    info[i].className = ("info")
    name_surname[i].className = ("name_surname")
    born_die[i].className = ("born_die")
    document.querySelector('.search_panel').after(userCard[i])
    userCard[i].append(img_info[i])
    img_info[i].append(account_img[i])
    img_info[i].append(info[i])
    info[i].append(name_surname[i])
    info[i].append(born_die[i])
    let needId = 0
    for(let i = 0; i < responseUsers.length; i++){
        for (let key in responseUsers[i]){
            if (responseUsers[i][key] == id) {
                needId = i
            }
        }
    }
    account_img[i].src = responseUsers[needId].img
    name_surname[i].innerHTML = responseUsers[needId].name + " " + responseUsers[needId].surname;
    born_die[i].innerHTML = responseUsers[needId].born + " - " + aliveCheck(responseUsers[needId].die)
    userCard[i].addEventListener("click", openAccount)
}

function search () {
    let body = {
        reqnumber: 8,
    }
    searchUsers = JSON.parse(JSON.stringify(responseUsers))
    let nameSurname 
    let searchscore = 0
    let arrayOfSearch = []
    let searchString = document.querySelector('.search_input').value
    searchString = searchString.trim().toLowerCase()
    searchUsers.forEach(element => {
        element.searchscore = 0     
        nameSurname = (element.name + element.surname).toLowerCase()
        let pos = -1;
        for (let i = 0; i < searchString.length; i++) {
            while ((pos = nameSurname.indexOf(searchString[i], pos + 1)) != -1){
                element.searchscore = searchscore++
            }
        }  
        searchscore = 0 
    });
    searchUsers.sort((a,b)=> a.searchscore > b.searchscore ? 1 : -1)
    for (let i = 0; i < searchUsers.length; i++){
        userCard[i].remove()
    }
    i= 0
    showUserCard(searchUsers[(searchUsers.length-1)].id)
}

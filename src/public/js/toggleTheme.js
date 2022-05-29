

// Dark mode toggler
const themeCheck = document.getElementById("toggle-theme");

themeCheck.addEventListener('change', function(e){
    let checked = e.target.checked;
    console.log(checked)
    let themeCSS = document.getElementsByTagName('link')[2];
    if(checked){
        localStorage.setItem('DarkTheme', 'true')
        themeCSS.setAttribute('href', '/css/bootstrap-night.min.css')
    } else {
        localStorage.setItem('DarkTheme', 'false')
        themeCSS.setAttribute('href', '/css/bootstrap.min.css')
    }
})

// function User (username) {
//     this.username = username

//     this.sayHello = function(){
//         console.log(username)
//     }

// }

// const user = new User(user)

// console.log(user)
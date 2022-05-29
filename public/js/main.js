window.onload = function () { 
    //Register service worker
    navigator.serviceWorker
        .register('../sw_cached_site.js')
        .then(reg => console.log('Service Worker: Registered'))
        .catch(e => console.log(`Service Worker: Error: ${e}`))



    //check theme
    let themeCSS = document.getElementsByTagName('link')[2];
    if(localStorage.getItem('DarkTheme') === 'true'){
        themeCSS.setAttribute('href', '/css/bootstrap-night.min.css')
    } else {
        themeCSS.setAttribute('href', '/css/bootstrap.min.css')
    }

    if ( document.URL.includes("settings")) {
        if(localStorage.getItem('DarkTheme') === 'true'){
            document.getElementById("toggle-theme").checked = true;
        } else {
            document.getElementById("toggle-theme").checked = false;
        }
    }

}

class Help extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <a class="link-secondary d-flex justify-content-end" style="text-decoration: none;" href="/help"><i class="fa-solid fa-circle-question"></i></a>
    `;
  }
}

customElements.define('help-component', Help);


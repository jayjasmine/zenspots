//Use of Custom Design Components that are initially empty: //Fetch + JSON used in 4 GET requests:
fetch("/admin/showZenspots")
    .then(res => res.json())
    .then(zenspots => {
        //access table body
        let zenspot_list = document.getElementById("zenspot-list-tbody")
        //for store each book in 'book' variable and populate iwth data
        for (let zenspot of zenspots) {
            zenspot_list.innerHTML += `
            <tr>
            <td>${zenspot._id}</td>
            <td>${zenspot.title}</td>
            </tr>
            `
        }

    })

fetch("/admin/showComments")
    .then(res => res.json())
    .then(comments => {
        //access table body
        let comment_list = document.getElementById("comment-list-tbody")

        for (let comment of comments) {
            comment_list.innerHTML += `
            <tr>
            <td>${comment._id}</td>
            <td>${comment.body}</td>
            </tr>
            `
        }

    })

fetch("/admin/showUsers")
    .then(res => res.json())
    .then(users => {
        //access table body
        let user_list = document.getElementById("user-list-tbody")

        for (let user of users) {
            user_list.innerHTML += `
            <tr>
            <td>${user._id}</td>
            <td>${user.username}</td>
            </tr>
            `
        }

    })

fetch("/admin/showNews")
    .then(res => res.json())
    .then(news => {
        //access table body
        let news_list = document.getElementById("news-list-tbody")

        for (let newsp of news) {
            news_list.innerHTML += `
            <tr>
            <td>${newsp._id}</td>
            <td>${newsp.title}</td>
            </tr>
            `
        }

    })


let spinner = '<div class="spinner-border" role="status"></div>'

function handleSubmitZenspot() {
    //find form
    let form = document.getElementById("create-zenspot-form");
    //Check if form is valid, store result in variable
    let chk_status = form.checkValidity();
    //report form validity to client
    form.reportValidity();
    //if valid execute createbook function
    if (chk_status) {
        let submitBtn = document.getElementById("create-zenspot-btn")
        submitBtn.innerHTML = spinner;
        postCreateZenspot()
    }
}

function handleSubmitUser() {
    //find form
    let form = document.getElementById("create-user-form");
    //Check if form is valid, store result in variable
    let chk_status = form.checkValidity();
    //report form validity to client
    form.reportValidity();
    //if valid execute createbook function
    if (chk_status) {
        let submitBtn = document.getElementById("create-user-btn")
        submitBtn.innerHTML = spinner;
        postCreateUser()
    }
}

function handleSubmitNews() {
    //find form
    let form = document.getElementById("create-news-form");
    //Check if form is valid, store result in variable
    let chk_status = form.checkValidity();
    //report form validity to client
    form.reportValidity();
    //if valid execute createbook function
    if (chk_status) {
        let submitBtn = document.getElementById("create-news-btn")
        submitBtn.innerHTML = spinner;
        postCreateNews()
    }
}

function handleSubmitComment() {
    //find form
    let form = document.getElementById("create-comment-form");
    //Check if form is valid, store result in variable
    let chk_status = form.checkValidity();
    //report form validity to client
    form.reportValidity();
    //if valid execute createbook function
    if (chk_status) {
        let submitBtn = document.getElementById("create-comment-btn")
        submitBtn.innerHTML = spinner;
        postCreateComment()
    }
}


//Fetch + JSON used in 4 POST requests:

function postCreateNews() {
    // Get access to the create user form
    let createNewsForm = document.getElementById("create-news-form")

    formData = Object.fromEntries(new FormData(createNewsForm));
    // Convert the form fields into JSON
    let formDataJSON = JSON.stringify(formData)
    console.log(formDataJSON);
    // Post the form JSON to the backend

    fetch("/admin/createNews", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: formDataJSON
        })
        .then(res =>{
            console.log(res)
        })

}

function postCreateZenspot() {

    // Get access to the create user form
    let createZenspotForm = document.getElementById("create-zenspot-form")
    // accessRights = {
    //     "accessRights": document.getElementById("accessRights").value
    // }
    formData = Object.fromEntries(new FormData(createZenspotForm));
    // Convert the form fields into JSON
    let formDataJSON = JSON.stringify(formData)
    console.log(formDataJSON);
    // Post the form JSON to the backend
    fetch("/admin/createZenspot", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: formDataJSON
        })
        .then(res => res.json())
        .then(res => {
            alert(res)
        })
        .catch(err => {
            //handle the error from the server
            console.log("create zenspot request failed!" + err)
        })
}

function postCreateUser() {
    // Get access to the create user form
    let createUserForm = document.getElementById("create-user-form")

    formData = Object.fromEntries(new FormData(createUserForm));
    // Convert the form fields into JSON
    let formDataJSON = JSON.stringify(formData)
    console.log(formDataJSON);
    // Post the form JSON to the backend

    fetch("/admin/createUser", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: formDataJSON
        })
        .then(res => res.json())
        .catch(err => {
            //handle the error from the server
            console.log("create user request failed!" + err)
        })
}

function postCreateComment() {
    // Get access to the create comment form
    let createCommentForm = document.getElementById("create-comment-form")

    formData = Object.fromEntries(new FormData(createCommentForm));
    // Convert the form fields into JSON
    let formDataJSON = JSON.stringify(formData)
    console.log(formDataJSON);
    // Post the form JSON to the backend

    fetch("/admin/createComment", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: formDataJSON
        })
        .then(res => res.json())
        .then(res => {
            alert(res)
        })
        .catch(err => {
            //handle the error from the server
            console.log("create user request failed!" + err)
        })
}

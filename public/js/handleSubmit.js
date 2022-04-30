let spinner = '<div class="spinner-border" role="status"></div>'

function handleSubmit() {
    //find form
    let form = document.getElementsByTagName('form')[0];
    //Check if form is valid, store result in variable
    let chk_status = form.checkValidity();
    //report form validity to client
    form.reportValidity();
    //if valid execute createbook function
    if (chk_status) {
        let submitBtn = document.getElementById('form-btn')
        submitBtn.innerHTML = spinner;
    }
}
function handleCommentSubmit() {
    //find form
    let form = document.getElementById('comment-form')
    //Check if form is valid, store result in variable
    let chk_status = form.checkValidity();
    //report form validity to client
    form.reportValidity();
    //if valid execute createbook function
    if (chk_status) {
        let submitBtn = document.getElementById('new-comment-btn')
        submitBtn.innerHTML = spinner;
    }
}
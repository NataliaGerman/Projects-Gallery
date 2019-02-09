function openCanvas(){
    document.querySelector('.offcanvas-btn').classList.toggle('offcanvas-btn-open');
    document.querySelector('.offcanvas-aside').classList.toggle('offcanvas-aside-open');    
}


function onSubmitMessage(ev){
    ev.prevemtdefault();
    let subject=$('.subject').val();
    let email=$('.email').val();
    let message=$('.message').val();
    let sendLink=`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&b ody=${message}`
    window.open (sendLink,'_blank')
    toggleCanvas();

    //reset form
    $('.subject').val('');
    $('.email').val('');
    $('.message').val('')
}
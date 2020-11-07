$( document ).ready(function() {
    $( ".proceed-checkout" ).click(function() {
        if(localStorage.getItem("loginStatus") === 'true'){
            location.href = "./checkout.html";
        }else{
            location.href = "./login.html";
        }
    });
});
$( document ).ready(function() {
    if(localStorage.getItem("loginStatus") === 'true'){
      console.log("true")
      $('.loggedin-icon').children().removeClass('fa fa-sign-in');
      $('.loggedin-icon').children().addClass('fa fa-user');
      $('.loggedin-icon').attr('href','#');
    }else{
      localStorage.setItem('loginStatus','false');
      $('.loggedin-icon').children().removeClass('fa fa-user');
      $('.loggedin-icon').children().addClass('fa fa-sign-in');
    }
    $( ".loggout-icon" ).click(function() {
      localStorage.setItem('loginStatus','false');
      $('.login-dropdown').toggleClass('addFlex');
      $('.loggedin-icon').children().removeClass('fa fa-user');
      $('.loggedin-icon').children().addClass('fa fa-sign-in');
      $('.loggedin-icon').attr('href','./login.html');
      window.location.replace('index.html');
    });
    $(document).on('click','.fa-user', function(){
      $('.login-dropdown').toggleClass('addFlex');
    });
    // Wallet & Redeem val
    let walletVal = 0, redeemVal = 0;
    $('.walletVal').text(walletVal);
    $('.redeemVal').text(redeemVal);
});
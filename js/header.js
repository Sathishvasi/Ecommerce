(function ($) {
    if(localStorage.getItem("loginStatus") === 'true'){
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
})(jQuery);
function viewBagCallback(res){
  if(res.desc === "success" && Array.isArray(res.data)){
    console.log('Got Bag Items successfully'+res.data.length);
    //Original cart count(Number of items)
    var bagCount = res.data.length;
    $('.bag-count').text(bagCount);
   
  }else{
    console.log('Facing some issue, Will try after some time / No items in Cart');
  }
}
async function viewBag(userId,viewBagCallback){
  // Need to replace atb data here
  var queryParam = 'userId='+userId;
  var apiData = {
      "queryParam": queryParam,
      "pathParam": "/order/getUserCartDetails",
      "requestMethod": "POST"
  }
  const res =  await  makeAPI(apiData,viewBagCallback);
}
$( document ).ready(function() {
    viewBag(111,viewBagCallback);
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
$( document ).ready(function() {
    $( ".proceed-checkout" ).click(function() {
        if(localStorage.getItem("loginStatus") === 'true'){
            let userId = '111';
            // get orderID from cart API
            $.post(`http://ec2-13-58-84-7.us-east-2.compute.amazonaws.com:7071/order/getUserCartDetails?userId=${userId}`, function(response) {
                let orderID = response.data[0].orderId;
                // confirm order API    
                $.post( `http://ec2-13-58-84-7.us-east-2.compute.amazonaws.com:7071/order/confirmorder?userId=${userId}&orderId=${orderID}`, function( data ) {
                    if(data.desc === 'success'){
                        location.href = "./checkout.html";
                    }
                });
            })
            // location.href = "./checkout.html";
            
        }else{
            location.href = "./login.html";
        }
    });
});
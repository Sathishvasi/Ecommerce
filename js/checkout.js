$( document ).ready(function() {
    let userId = 111;
    $.post("http://ec2-13-58-84-7.us-east-2.compute.amazonaws.com:7071/order/getUserCartDetails?userId="+userId, function (response, status) {
        // console.log("Data: ", data);
        let data = response.data;
        let products = '';
        console.log(data);
        let redeemPercentage = 0;
        let redeemRewardValue = response.redeemRewardValue;
        let taxPercentage = 5
        let cartSubTotal = 0;
        data.forEach(function(val,index){
            products+= `<div class="purchased__product"><div>${val.productName}</div><div><div class="redeempoint-cont position-relative"><img src="./img/star.png" alt=""/><div>0</div></div></div><div>₹${val.totalPrice}.00</div></div>`
            // redeemPercentage = redeemPercentage + redeemRewardValue*val.redeemPercentage;
            cartSubTotal+= val.totalPrice;
            // console.log(val)
        })
        let taxValue = (cartSubTotal/100)*taxPercentage;
        $('.purchased__products').append(products);
        $('.checkout__order__subtotal span').text("₹"+cartSubTotal+".00");
        $('.checkout__order__tax span').text("₹"+taxValue);
        $('.checkout__order__total span').text("₹"+(cartSubTotal + taxValue));
        if(redeemPercentage > 0){
            $('.checkout__order__redeem_total span').text(redeemPercentage);
            $('.checkout__order__redeem_total').append(`<div class="redeem-success-message">Congrats, you have earned ${redeemPercentage} redeem points for this order</div>`);
        }

        //Prefilling Billing Details
        $('.checkout__form .first-name').val("Sathish");
        $('.checkout__form .last-name').val("Kumar");
        $('.checkout__form .address-line1').val("19/a");
        $('.checkout__form .address-line2').val("Railway colony");
        $('.checkout__form .city').val("Dgl");
        $('.checkout__form .state').val("Tamilnadu");
        $('.checkout__form .zip-code').val("624005");
        $('.checkout__form .phone').val("8861927499");
        $('.checkout__form .email').val("sathish17595@gmail.com");

        //Enable loader
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");
    });

    $('.place-order').on('click',function(e) {
        e.preventDefault();
        $.post("http://ec2-13-58-84-7.us-east-2.compute.amazonaws.com:7071/order/getUserCartDetails?userId="+userId, function (response, status) {
            if(response.desc === "success"){
                let orderId = response.data[0].orderId;
                $.post( `http://ec2-13-58-84-7.us-east-2.compute.amazonaws.com:7071/order/confirmorder?userId=${userId}&orderId=${orderId}`, function( data ) {
                    if(data.desc === 'success'){
                        $('.thankyou-wrapper').fadeIn();
                        $('body').css('overflow','hidden')
                    }else{
                        showSnackBar("Unable to place order right now");
                    }
                });
            }else{

            }
        })
    })

});
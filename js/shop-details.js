
function viewBagCallback(res){
    // Need to check the original response here.
    if(res.desc === "success" && Array.isArray(res.data)){
      console.log('Got Bag Items successfully'+res.data.length);
      //Original cart count
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
function atbCallback(res){
    // Need to check the original response here.
    if(res.desc === "success"){
        showSnackBar('Product Added to Cart Successfully');
        viewBag(111,viewBagCallback);
    }else{
        showSnackBar('Facing some issue, Will try after some time');
    }
}
async function addtocart(qty,prodId,userId,atbCallback){
    // Need to replace atb data here
    var queryParam = 'productId='+prodId+'&productQuantity='+qty+'&userId='+userId;
    var apiData = {
        "queryParam": queryParam,
        "pathParam": "/order/add/cart",
        "requestMethod": "POST"
    }
    const res =  await  makeAPI(apiData,atbCallback);
}

$( document ).ready(function() {

    $.get(`http://ec2-13-58-84-7.us-east-2.compute.amazonaws.com:7071/product/details/getProductDetails?productId=${localStorage.getItem('productId')}`, function(response, status) {
            $(".loader").fadeOut();
            $("#preloder").delay(200).fadeOut("slow");
            console.log(response);

            let productDetail = response.data;
            let parentEle = $('.product-details');
            $('.product-details').attr('id',productDetail.productId);
            $('.product__details__pic__item--large').attr('src',productDetail.product_image === null || productDetail.product_image === "" ? "img/placeholder.png": productDetail.product_image);
            $('.product__details__text h3').text(productDetail.productName);
            $('.product__details__price').text('Rs.'+productDetail.pricePerUnit);
            $('.product__details__text p').text(productDetail.productDesc);
            $('.p-weight').text(productDetail.min_range+" "+productDetail.productUnit);
            $('.p-availability').text(productDetail.product_status.toLocaleLowerCase() === "available" ? "In Stock" : "Out of Stock");
            $('.product__details__rating span').text(`(${productDetail.misc})`);
            $('.pro-qty input').val(productDetail.min_range);

            //Set local
            var productDetails = {
                productPrice: productDetail.pricePerUnit,
                productMaxQuantity: productDetail.max_range,
                productMinQuantity: productDetail.min_range
            }
        localStorage.setItem('productDetails', JSON.stringify(productDetails));
    })

    $(document).on('click','.add-cart', function(e){
        e.preventDefault();
        var userId = 111;
        var prodDetails = JSON.parse(localStorage.getItem('productDetails'));
        console.log(prodDetails);
        var qty = parseInt($('.product-atp-qty').val() / prodDetails.productMinQuantity) || parseInt(prodDetails.productMinQuantity);
        var prodId = $(".product-details").attr("id") || 0;
        addtocart(qty,prodId,userId,atbCallback);
    });

    $(document).on('click','.heart-icon', function(e){
        e.preventDefault();
        showSnackBar('Product added to favourites')
    });
});

$( document ).ready(function() {
  function atbCallback(res){
    if(res.desc === "success"){
        showSnackBar('Cart Item Updated Successfully');
    }else{
        showSnackBar('Unable to add item into cart');
    }
    $('.quantity').removeClass('ptrevtsne');
  }
  async function addtocart(orderId,qty,prodId,userId,atbCallback){
    var queryParam = 'productId='+prodId+'&productQuantity='+qty+'&userId='+userId+'&orderId='+orderId;
    var apiData = {
        "queryParam": queryParam,
        "pathParam": "/order/add/cart",
        "requestMethod": "POST"
    }
    const res =  await  makeAPI(apiData,atbCallback);
  }
  function removeItemCallback(res){
    if(res.desc === "success"){
      $(".cart-items-table").empty();
      renderItems();
      showSnackBar('Item Removed from Cart Successfully');
    }else{
      showSnackBar('Unable to remove item from cart');
    }
    $('.cart-item-remove').removeClass('ptrevtsne');
  }
  async function removefromcart(orderId,prodId,userId){
    var queryParam = 'productID='+prodId+'&userID='+userId+'&orderID='+orderId;
    var apiData = {
      "queryParam": queryParam,
      "pathParam": "/order/deleteProductInCart",
      "requestMethod": "POST"
    }
    const res =  await  makeAPI(apiData,removeItemCallback);
  }

  let products = "",
  productCategory,
  categoryArray = [],
  subtotal = 0,
  currentOrderId = "",
  userId = 111;

  function renderItems(){
    $.post("http://ec2-13-58-84-7.us-east-2.compute.amazonaws.com:7071/order/getUserCartDetails?userId="+userId, function (response, status) {
      products = "";
      let data = Array.isArray(response.data) ? response.data : [];
      if(data.length){
        $('.cart-table-titles').removeClass('hide');
        $('.proceed-checkout').removeClass('ptrevtsne');
        currentOrderId = response.data[0].orderId;
      }else{
        $('.cart-table-titles').addClass('hide');
        $('.proceed-checkout').addClass('ptrevtsne');
        showSnackBar("Cart items are empty, please continue shopping");
      }

      data.forEach((val, index) => {
        products += `<tr>
                      <td class="shoping__cart__item" prodId="${val.productId}">
                          <img src="${val.productImg}" alt="">
                          <h5>${val.productName}</h5>
                      </td>
                      <td class="shoping__cart__price">
                          ₹${val.pricePerUint}
                      </td>
                      <td class="shoping__cart__quantity">
                          <div class="quantity">
                              <div class="pro-qty">
                                  <input type="text" value="${val.quantity*val.minRange}" disabled>
                              </div>
                          </div>
                      </td>
                      <td class="shoping__cart__total">
                          ₹${parseFloat(val.totalPrice)}
                      </td>
                      <td class="shoping__cart__item__close">
                          <span class="icon_close cart-item-remove"></span>
                      </td>
                  </tr>`;
        subtotal += parseFloat(val.totalPrice);
      });

      //Price append
      let taxPercentage = 5;
      let taxValue = (subtotal/100)*taxPercentage;
      $(".cart_sub-total").text("₹" + subtotal + ".00");
      $(".cart_tax").text("₹" + taxValue);
      $(".cart_total").text("₹" + (taxValue + subtotal));

      // Product append
      $(".cart-items-table").append(products);

      /*-------------------
              Quantity change
          --------------------- */
      var proQty = $(".pro-qty");
      proQty.prepend('<span class="dec qtybtn">-</span>');
      proQty.append('<span class="inc qtybtn">+</span>');
      proQty.on("click", ".qtybtn", function () {
        
        var $button = $(this);
        var newQty = 0;

        var curProdId = $button.parents().children().find(".shoping__cart__item").attr('prodid');

        var curProdDetails = data.filter(function (obj) { 
            return obj.productId == curProdId; 
          })[0];

        var oldValue = $button.parent().find("input").val();

        var newVal;

        if ($button.hasClass("inc")) {
          let maxQuantity = curProdDetails.maxRange;
          if (parseFloat(oldValue) < maxQuantity) {
            newQty  = 1;
            newVal = parseFloat(oldValue) + parseFloat(curProdDetails.minRange);
          } else {
            newVal = parseFloat(oldValue);
          }
        } else {
          // Don't allow decrementing below zero
          if (oldValue > curProdDetails.minRange) {
            newVal = parseFloat(oldValue) - curProdDetails.minRange;
            newQty = -1;
          } else {
            newVal = curProdDetails.minRange;
          }
        }

        $button.parent().find("input").val(newVal);

        let item = $(this).closest("tr").find(".shoping__cart__total");
        let currPrice = $(this).closest("tr").find(".shoping__cart__price");
        let itemTotal = parseInt(currPrice.text().replace("₹", ""));
        // product current item
        item.text("₹" + itemTotal * (newVal/parseFloat(curProdDetails.minRange)));

        // cart subtotal
        $(".cart_sub-total").text("₹" + getTotal() + ".00");

        // cart total
        applyTotal();
        if(newQty === 0){
          var errMsg = `Quantity should be with in ${curProdDetails.minRange} and ${curProdDetails.maxRange}`;
          showSnackBar(errMsg);
        }else{
          $('.quantity').addClass('ptrevtsne');
          addtocart(currentOrderId,newQty,curProdId,userId,atbCallback);
        }
      });

      //Enable loader
      $(".loader").fadeOut();
      $("#preloder").delay(200).fadeOut("slow");
    });
  }

  if (localStorage.getItem("loginStatus") === "true") {
    $(".header__cart ul li:last-child i").attr("class", "fa fa-user");
    $(".header__cart ul li:last-child>a").attr("href", "#");
  }

  $("#wallet-input").on("keyup", function () {
    let currentVal = $(this).val();
    if (currentVal.length != "") {
      $(this).siblings().addClass("active");
      $(this).siblings().prop("disabled", false);
    } else {
      $(this).siblings().removeClass("active");
      $(this).siblings().prop("disabled", true);
    }
  });
  $(".wallet-form").on("submit", function (e) {
    e.preventDefault();
    let inputVal = parseInt($("#wallet-input").val());
    let existingVal = parseInt($(".walletVal").text());
    let existingWalletVal = parseInt($(".cart_wallet").text().replace("?", "").replace("-", ""));
    let difference = existingVal - inputVal;
    if (inputVal > 0 && difference > 0) {
      showSnackBar("Offer applied successfully");
      //update wallet value in total section
      $(".cart_wallet").text("- ?" + (inputVal+existingWalletVal) + ".00");
      //clearing wallet input
      $("#wallet-input").val("");
      //update wallet values
      $('.walletVal').text(difference);
      //update primary total
      let walletVal = parseInt($(".cart_wallet").text().replace("?", "").replace("-", ""));
      let subTotal = parseInt($(".cart_sub-total").text().replace("?", ""));
      let taxVal = parseInt($(".cart_tax").text().replace("?", ""));

      $(".cart_total").text("₹" + Math.abs((taxVal+subTotal) - walletVal) + ".00");
    } else {
      showSnackBar("Insufficient money");
    }
  });

  function getTotal() {
    let total = 0;
    $(".shoping__cart__table tr").each((index, val) => {
      let item = $(val).find(".shoping__cart__total");
      let itemTotal = parseInt(item.text().replace("₹", ""));
      if (index > 0) {
        total += itemTotal;
      }
    });
    return total;
  }

  function applyTotal(){
    let taxVal = parseInt($(".cart_tax").text().replace("₹", ""));
    let walletVal = parseInt($(".cart_wallet").text().replace("₹", ""));
    walletVal = walletVal ? walletVal : 0;
    $(".cart_total").text("₹" + (taxVal + walletVal + getTotal()) + ".00");
  }

  $( ".proceed-checkout" ).click(function() {
      if(localStorage.getItem("loginStatus") === 'true' && currentOrderId !== ""){
        location.href = "./checkout.html";
      }else{
        location.href = "./login.html";
      }
  });

  $(document).on('click','.cart-item-remove', function(e){
    e.preventDefault();
    var curProdId = $(this).parents().children().find(".shoping__cart__item").attr('prodid');
    $.post("http://ec2-13-58-84-7.us-east-2.compute.amazonaws.com:7071/order/getUserCartDetails?userId="+userId, function (response, status) {
      if(response.desc === "success"){
        let orderId = response.data[0].orderId;
        $('.cart-item-remove').addClass('ptrevtsne');
        removefromcart(orderId,curProdId,userId)
      }else{
        showSnackBar("Unable to get view bag items");
      }
    });
  });

  renderItems();
});
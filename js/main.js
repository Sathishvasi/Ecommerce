/*  ---------------------------------------------------
    site Name: Ecommerce
    Description:  Ecommerce eCommerce  HTML site
    Author: ecommerce
    Author URI: https://ecommerce.com
    Version: 1.0
    Created: ecommerce
---------------------------------------------------------  */

'use strict';

(function($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function() {
        /*------------------
            Gallery filter
        --------------------*/
        $(document).on('click', '.featured__controls li', function() {
            $('.featured__controls li').removeClass('active');
            $(this).addClass('active');
        });
        // if ($('.featured__filter').length > 0) {
        //     var containerEl = document.querySelector('.featured__filter');
        //     var mixer = mixitup(containerEl);
        // }
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function() {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    //Humberger Menu
    $(document).on('click', '.humberger__open', function() {
        $(".humberger__menu__wrapper").addClass("show__humberger__menu__wrapper");
        $(".humberger__menu__overlay").addClass("active");
        $("body").addClass("over_hid");
    });

    $(document).on('click', '.humberger__menu__overlay', function() {
        $(".humberger__menu__wrapper").removeClass("show__humberger__menu__wrapper");
        $(".humberger__menu__overlay").removeClass("active");
        $("body").removeClass("over_hid");
    });

    /*------------------
		Navigation
	--------------------*/
    // $(".mobile-menu").slicknav({
    //     prependTo: '#mobile-menu-wrap',
    //     allowParentLinks: true
    // });

    /*-----------------------
        Categories Slider
    ------------------------*/


    $('.hero__categories__all').on('click', function() {
        $('.hero__categories ul').slideToggle(400);
    });

    /*--------------------------
        Latest Product Slider
    ----------------------------*/
    // $(".latest-product__slider").owlCarousel({
    //     loop: true,
    //     margin: 0,
    //     items: 1,
    //     dots: false,
    //     nav: true,
    //     navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
    //     smartSpeed: 1200,
    //     autoHeight: false,
    //     autoplay: true
    // });

    /*-----------------------------
        Product Discount Slider
    -------------------------------*/
    $(".product__discount__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 3,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

            320: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 2,
            },

            992: {
                items: 3,
            }
        }
    });

    /*---------------------------------
        Product Details Pic Slider
    ----------------------------------*/
    // $(".product__details__pic__slider").owlCarousel({
    //     loop: true,
    //     margin: 20,
    //     items: 4,
    //     dots: true,
    //     smartSpeed: 1200,
    //     autoHeight: false,
    //     autoplay: true
    // });

    /*-----------------------
		Price Range Slider
	------------------------ */
    var rangeSlider = $(".price-range"),
        minamount = $("#minamount"),
        maxamount = $("#maxamount"),
        minPrice = rangeSlider.data('min'),
        maxPrice = rangeSlider.data('max');
    rangeSlider.slider({
        range: true,
        min: minPrice,
        max: maxPrice,
        values: [minPrice, maxPrice],
        slide: function(event, ui) {
            minamount.val('$' + ui.values[0]);
            maxamount.val('$' + ui.values[1]);
        }
    });
    minamount.val('$' + rangeSlider.slider("values", 0));
    maxamount.val('$' + rangeSlider.slider("values", 1));

    /*--------------------------
        Select
    ----------------------------*/
    $("select").niceSelect();

    /*------------------
		Single Product
	--------------------*/
    // $('.product__details__pic__slider img').on('click', function () {

    //     var imgurl = $(this).data('imgbigurl');
    //     var bigImg = $('.product__details__pic__item--large').attr('src');
    //     if (imgurl != bigImg) {
    //         $('.product__details__pic__item--large').attr({
    //             src: imgurl
    //         });
    //     }
    // });

    /*-------------------
		Quantity change
    --------------------- */
    function updateProductWeight(oldValue, newVal) {
        let currentPrice = parseFloat($('.p-weight').text().split(' ')[0]);
        let unit = $('.p-weight').text().split(' ')[1];
        let quantityPrice = (currentPrice / oldValue);
        let updatedWeight = (quantityPrice * newVal) + " " + unit;
        $('.p-weight').text(updatedWeight)
    }

    var proQty = $('.pro-qty');
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    proQty.on('click', '.qtybtn', function() {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            let productDetail = JSON.parse(localStorage.getItem('productDetails'));
            let maxQuantity = productDetail.productQuantity;
            if (parseFloat(oldValue) < maxQuantity) {
                var newVal = parseFloat(oldValue) + 1;
                //Update weight
                updateProductWeight(oldValue, newVal)
            } else {
                var newVal = parseFloat(oldValue)
            }
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 1) {
                var newVal = parseFloat(oldValue) - 1;
                //Update weight
                updateProductWeight(oldValue, newVal)
            } else {
                newVal = 1;
            }
        }
        $button.parent().find('input').val(newVal);
    });

    $(document).on('click', '.featured__item__pic', function() {

        var productDetails = {
            productID: $(this).data('id'),
            productName: $(this).data('title'),
            productImage: $(this).data('img'),
            productDesc: $(this).data('desc'),
            productPrice: $(this).data('price'),
            productStatus: $(this).data('status'),
            productWeight: $(this).data('weight'),
            productQuantity: $(this).data('quantity')
        }
        console.log(productDetails);
        localStorage.setItem('productDetails', JSON.stringify(productDetails));
        location.href = "shop-details.html";
    });

    $(document).on('click', '.trigger-search', function() {
        let inputVal = $('.trigger-search').siblings('input').val();
        if (inputVal != '') {
            localStorage.setItem("searchKey", inputVal);
            location.href = "./result.html";
        }
    })


})(jQuery);

function formatSpace(str) {
    return str.replace(/[\s]/gi, '-').toLowerCase();
}

function showSnackBar(text) {
    $('#snackbar').text(text);
    $('#snackbar').addClass('show');
    setTimeout(function() { $('#snackbar').removeClass('show'); }, 3000);
}

$('[data-toggle="tooltip"]').tooltip();

$(document).ready(function() {
    if (location.href !== '/index.html')
        $("#header-wrapper").load("header.html", function() {
            $('.hero').css('padding-top', $('.header').height() + 30)
        });
})
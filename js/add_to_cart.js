(function ($) {
  $(function () {
    var endPoint = 'http://localhost:3000/cart';
    $.get({
      url: endPoint,
      beforeSend: function () {
        if ($('.showcase')) {
          $('.gooditem').addClass('showcase__loading');
        }
      }
    }).done(function (cart) {
      $('.shp_cart__loading').hide();
      refreshShowcase(cart);
      renderCart(cart);
    });
    if ($('.showcase')) {
      $('.addtocart_button').click(function () {
        var button = $(this);
        if (!button.parent().hasClass('incart')) {
          $.post({
            url: endPoint,
            beforeSend: function () {
              button.parent().toggleClass('showcase__loading');
            },
            data: {
              productId: button.parent().attr('productId'),
              price: button.next().children('.item_cost').text(),
              imgURL: button.prev().css('background-image'),
              productName: button.next().children(':first').text()
            }
          }).done(function () {
            button.parent().addClass('incart').toggleClass('showcase__loading');
            refreshCart();
          });
        }
      });
    }

    function renderCart(cart) {
      if (cart.length) {
        var totalCost = 0;
        for (var i = 0; i < cart.length; i++) {
          var itemInCart = $('<div />')
              .addClass('gooditem_incart')
              .attr({
                productId: cart[i].productId,
                id: cart[i].id
              }),
            img = $('<div />')
              .addClass('image')
              .css('background-image', cart[i].imgURL),
            cross = $('<div />')
              .addClass('item_cross')
              .click(deleteItem),
            name = $('<div />').text(cart[i].productName),
            itemCost = $('<p />').addClass('item_cost').text(cart[i].price),
            a = $('<a href=# />').append(name, itemCost, $('<div >'));
          itemInCart.append(img, cross, a);
          $('.shp_cart__list').append(itemInCart);
          totalCost += parseInt(cart[i].price);
        }
        $('.shp_cart__empty').hide();
        $('.shp_cart__total').show().children('span').text(totalCost);
        $('.shp_cart__checkout, .shp_cart__gotocart').show();
        $('.items_number').show().text(cart.length);
      } else {
        $('.shp_cart__empty').show();
        $('.shp_cart__checkout, .shp_cart__gotocart').hide();
        $('.items_number').hide();
        $('.shp_cart__total').hide();
      }
    }
      
    function refreshCart() {
      $.get({
        url: endPoint
      }).done(function (cart) {
        $('.shp_cart__list').empty();
        renderCart(cart);
        refreshShowcase(cart);
        $('.shp_cart__list').removeClass('cart__list_loading');
      });
    }

    function refreshShowcase(cart) {
      if ($('.showcase')) {
        $('.gooditem').removeClass('showcase__loading incart');
        Object.keys(cart).forEach(function (value) {
          $('.gooditem[productId="' + this[value].productId + '"]').addClass('incart');
        }, cart);
      }
    }

    function deleteItem() {
      $.ajax({
        method: 'DELETE',
        url: endPoint + '/' + $(this).parent().attr('id'),
        beforeSend: function () {
          $('.shp_cart__list').addClass('cart__list_loading');
        }
      }).done(function () {
          refreshCart();
        }
      );
    }

  });  
})(jQuery);
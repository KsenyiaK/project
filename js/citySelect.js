(function ($) {
  $(function () {
    var $cityRE = /^[а-яё]+$/i;
    var $cityInput = $('#city_input');
    var $divParent = $('#city_input_form');
    $cityInput.on('keyup', function () {
      if ($cityRE.test(this.value)) {
        $divParent.removeClass('wrong_input');
        $divParent.removeClass('wrong_city')
        $('#city_list').remove();
        if ($cityInput.val().length > 2) {
          var $citiesArr = [];
          $.ajax({
            url: 'http://api.spacenear.ru/index.php',
            type: 'POST',
            beforeSend: function () {
              $('.acc__label_loader').show();
            },
            data: {pattern: this.value},
            dataType: 'json',
            success: function (cities) {
              if (cities) {
                console.log(cities);
                $citiesArr = cities.map(function (value) {
                  return value.name;
                });
              }
            },
            error: function () {
              console.log('Error');
            }
          }).done(function () {
            $('.acc__label_loader').hide();
            if (!$('#city_list').length && $citiesArr.length > 0) {
              var $select = $('<select />').attr({
                id: 'city_list',
                size: function () {
                  if ($citiesArr.length > 2) {
                    return $citiesArr.length;
                  }
                  return 2;
                }
              }).hide();
              for (var i = 0; i < $citiesArr.length; i++) {
                var $option = $('<option />');
                $option
                  .attr('value', $citiesArr[i])
                  .text($citiesArr[i])
                  .dblclick(function () {
                  $cityInput.val(this.value);
                  $(this).parent().slideUp(function () {
                    $(this).remove();
                  });
                });
                $select.append($option);
              }
              $divParent.append($select);
              $($select).slideDown();
            } else if ($citiesArr.length === 0) {
              $divParent.addClass('wrong_city');
              $('#city_list').slideUp(function () {
                $(this).remove();
              });
            }
          });
        }
      } else {
        $divParent.addClass('wrong_input');
        $('#city_list').slideUp(function () {
          $(this).remove();
        });
      }
    });
  });
})(jQuery);
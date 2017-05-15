//jscs:disable requireCamelCaseOrUpperCaseIdentifiers

  'use strict';

  $(function() {
    
    /**
     * document.documentElement: 'html', for Mozilla Firefox
     * document.body: 'body', for other browsers
     */
    var containers = [
      document.body,
      document.documentElement
    ];

    var $scrollBtn = $('#scroll-top');

    function updateScrollBtnCls() {
      var scrollTop = containers.reduce(function(result, element) {
        return result + element.scrollTop;
      }, 0);

      $scrollBtn.toggleClass('hidden', scrollTop < 100);
    }

    $scrollBtn.on('click', function() {
      window.onscroll = null;

      $(this).addClass('hidden');

      $(containers).animate({
        scrollTop: 0
      }, 500, $.proxy(function() {
        window.onscroll = updateScrollBtnCls;
      }, this));
    });

    window.onscroll = updateScrollBtnCls;

    $(':checkbox').checkboxpicker({
      groupCls: 'm-b'
    });

    updateScrollBtnCls();
  });
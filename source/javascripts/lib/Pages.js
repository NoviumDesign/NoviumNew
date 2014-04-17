// Pages class

var Pages = function ()
{
  var
    slideDuration = 700,
    pageHolder = $('.slider'),
    that = this;

  this.currentPageIndex = 0;
  this.slideTimer;

  this.getPage = function (index)
  {
    if (0 <= index && index <= pageHolder.children('.page').length - 1)
    {
      return pageHolder.children('.page').eq(index);
    }
    
    return false
  }

  this.getCurrentPage = function ()
  {
    return this.currentPageIndex;
  }

  this.findPage = function (htmlId)
  {
    var page;

    if (htmlId.length > 0)
    { 
      page = pageHolder.children('.page').filter('#' + htmlId);

      if (page.length)
      {
        return page;
      }
    }
    
    return false
  }

  this.setPage = function (index)
  {
    var 
      page = this.getPage(index),
      offset;

    if (page)
    {
      offset = pageHolder.offset().left - page.offset().left;

      this.storePageIndex(index);

      pageHolder.css('marginLeft', offset);
    }
  }

  this.slideTo = function (index)
  {
    // slide
    if (this.getPage(index))
    {
      pageHolder.addClass('slide');

      this.setPage(index)

      // reset timer
      clearTimeout(this.slideTimer);

      this.slideTimer = setTimeout(function ()
      {
        // remove slide transition class when completed
        pageHolder.removeClass('slide');
      }, slideDuration);
    }
  }

  this.setOffset = function (x)
  {
    pageHolder.removeClass('slide');

    pageHolder.css('marginLeft', x);

    // setTimeout(function ()
    //   {
    //     pageHolder.addClass('slide');
    //   },
    //   0
    // );
  }

  this.getOffset = function ()
  {
    var
      offsetLeft = pageHolder.offset().left,
      offsetRight = - pageHolder.width() - offsetLeft + $(window).width();

    return {left: offsetLeft, right: offsetRight};
  }

  this.getPageWidth = function ()
  {
    return pageHolder.children('.page').width();
  }

  this.storePageIndex = function (i)
  {
    // page id -> body class
    $('body').removeClass(this.getPage(this.currentPageIndex).attr('id'));
    $('body').addClass(this.getPage(i).attr('id'));

    // store page index
    this.currentPageIndex = i;

    // "no" classes
    $('body').removeClass('no-left no-right');
    if (0 == this.currentPageIndex)
    {
      // no scroll left
      $('body').addClass('no-left');
    }
    if ($('.slider .page').length == this.currentPageIndex + 1)
    {
      // no scroll right
      $('body').addClass('no-right');
    }
  }

  this.resize = function ()
  {
    var n, width;

    width = $(window).width();
    n = $('.slider .page').length;

    // setting width
    $('.slider').width(n*width);
    $('.slider .page').width(width);

    // resetting position
    this.setPage(this.currentPageIndex)
  }

  $(document).keydown(function (event)
  {
    var k = event.which;

    if (k == 39 || k == 40)
    {
      // right
      event.preventDefault();
      that.slideRight();
    }
    else if (k == 37 || k == 38)
    {
      // left
      event.preventDefault();
      that.slideLeft();
    }
  });

  $(window).resize(function ()
  {
    that.resize();
  });

  that.resize();
}
var Slider = function ()
{
  this.pages = new Pages();
  this.navigate = new Navigate(this.pages);
  this.touchSlide = new TouchSlide(this.pages, this.navigate);

  var that = this;

  this.slide = function (sign)
  {
    var
      pageIndex = this.pages.getCurrentPage(),
      page = this.pages.getPage(pageIndex + sign);

      if (page.length > 0)
      {
        this.navigate.to(page.attr('id'), 'link'); 
      }
  }

  $('.arrow.right').bind('click', function ()
  {
    that.slide(1);
  });
  $('.arrow.left').bind('click', function ()
  {
    that.slide(-1);
  });
}
// #= require_tree ./vendor
#= require_tree ./lib

var pages, touchSlide, navigate;

var initiate = function ()
{

  pages = new Pages();
  // pages.setPage(0)

  touchSlide = new TouchSlide(pages);
  navigate = new Navigate(pages);

}

initiate();


var slide = function (sign)
{
  var
    pageIndex = pages.getCurrentPage(),
    page = pages.getPage(pageIndex + sign);

    if (page.length > 0)
    {
      navigate.to(page.attr('id'), 'link'); 
    }
}

$('.arrow-right').click(function ()
{
  slide(1);
});
$('.arrow-left').click(function ()
{
  slide(-1);
});


$('.view-sidebar, .wrapper > .overlay').click(function ()
{
  if ($('body').is('.sidebar-visible'))
  {
    $('body').removeClass('sidebar-visible')
  }
  else
  {
    $('body').addClass('sidebar-visible')
  }
});
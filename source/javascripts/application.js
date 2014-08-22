// #= require_tree ./vendor
#= require_tree ./lib


var slider = new Slider();


$('.open-sidebar, .wrapper > .overlay, .close-sidebar').click(function ()
{
  if ($('body').is('.sidebar-visible'))
  {
    $('body').removeClass('sidebar-visible');
    $('.open-sidebar').removeClass('active');
  }
  else
  {
    $('body').addClass('sidebar-visible');
    $('.open-sidebar').addClass('active');
  }
});
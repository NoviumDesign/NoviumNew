Navigate = function (pagesClass)
{
  this.treated = false;

  var
    pageHolder = $('.slider'),
    that = this;

  this.slideTo = function (htmlId)
  {
    var section = pagesClass.findPage(htmlId);

    if (section)
    {
      pagesClass.slideTo(section.index());
    }
  }

  this.goTo = function (index)
  {
    var
      section = pagesClass.getPage(index),
      id;

    if (section)
    {
      id = section.attr('id');

      that.to(id, 'link')
    }
  }

  this.to = function (hash, type)
  {
    var pageIndex = pagesClass.findPage(hash).index();

    if (this.treated)
    {
      // alreday taken care of
      return false;
    }

    // set height and scroll
    pagesClass.preparePage(pageIndex);

    // stop propagation
    this.treated = true;

    // reset
    setTimeout(function ()
    {
      that.treated = false;
    }, 10);

    // type of event
    if (type == 'link')
    {
      this.hashedLink(hash);
    }
    else if (type == 'change')
    {
      this.changeHash(hash);
    }

  }

  this.changeHash = function (hash)
  {
    var
      page,
      section,
      triggerElement;

    console.log('hashchange:', hash)

    if (hash.length > 0)
    {
      page = pagesClass.findPage(hash);

      if (page)
      {
        // fires with click and hashchange

        // remove id
        page.attr('id', '');

        // create fake element with the removen id
        triggerElement = $('<div></div>')
          .css({
              position: 'absolute',
              visibility: 'hidden',
              left: '0px'
          })
          .attr('id', hash)
          .appendTo(document.body);

        // reload hash
        window.location.hash = '';
        window.location.hash = hash;

        page.attr('id', hash);

        // reset as before
        setTimeout(function ()
        {
          // needed as well aparently...
          $('.wrapper').scrollLeft(0);

          triggerElement.remove();
          page.attr('id', hash);

          that.slideTo(hash);
        }, 0);

      }
    }
  }

  this.hashedLink = function (hash)
  {
    var
      section,
      page;

    // console.log('click:', hash)

    if (hash.length > 0)
    {
      page = pagesClass.findPage(hash);

      if (page)
      {
        // remove id
        page.attr('id', '');

        // add hash
        window.location.hash = hash;

        // append id
        page.attr('id', hash);

        this.slideTo(hash);
      }
    }
  }

  $('a').click(function (event)
  {
    var
      href = $(this).attr('href'),
      hash = href ? href.replace(/^#/, '') : false;

    if (href && href.substring(0, 1) == '#')
    {
      // is #-link
      event.preventDefault();

      that.to(hash, 'link');
    }
  });

  $(window).on('hashchange', function (event)
  {
    // hash has changed
    event.preventDefault();

    var hash = window.location.hash.substring(1);

    that.to(hash, 'change'); 
  });


  this.loadPage = function ()
  {
    var
      pages = pageHolder.children('.page'),
      hash = window.location.hash.substring(1),
      pageIndex = pagesClass.findPage(hash).index();

    // remove all id's before the page is complete
    pages.each(function ()
    {
      var id = $(this).attr('id');

      // store id
      $(this).attr('temp-id', id);

      // remove id
      $(this).attr('id', '')
    });

    // page is loaded at x=0
    setTimeout(function ()
    {
      // restore all id's
      pages.each(function ()
      {
        var id = $(this).attr('temp-id');

        // reset id
        $(this).attr('id', id)

        // remove storage
        $(this).removeAttr('temp-id');
      });

      // set height and scroll
      pagesClass.preparePage(pageIndex);

      // move screen to desired page
      that.slideTo(hash);
    }, 0);
  }

  $(document).keydown(function (event)
  {
    var
      k = event.which,
      current = pagesClass.getCurrentPage();

    if (k == 39 || k == 40)
    {
      // right
      event.preventDefault();
      that.goTo(current + 1);
    }
    else if (k == 37 || k == 38)
    {
      // left
      event.preventDefault();
      that.goTo(current - 1);
    }
  });

  // launches document at right page
  this.loadPage();
}
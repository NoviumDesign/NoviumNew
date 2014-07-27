// TouchSlide class

var TouchSlide = function (pagesClass, navigateClass)
{
  var
    slideDuration = 0.3,
    fps = 60,
    pageHolder = $('.slider'),
    that = this;

  this.animOffsetX = 0;
  this.X = [];
  this.Y = [];
  this.T = [];
  this.timeout;

  this.slideStart = function (event)
  {
    var
      offset = pagesClass.getOffset();

    // reset for new slide
    this.X = [];
    this.Y = [];
    this.T = [];

    // store offset when (if) animation is interupted
    this.animOffsetX = offset.left;

    // abort timeout
    clearTimeout(this.timeout);
  }

  this.sliding = function (event)
  {
    var
      touch = event.originalEvent.touches[0], // one finger
      x,
      dx,
      dy;

    // save
    this.X.push(touch.pageX);
    this.Y.push(touch.pageY);
    this.T.push(event.timeStamp);

    // enable vertical scrolling
    if (this.X.length > 1)
    {
      dx = Math.abs(this.X[0] - this.X[1]);
      dy = Math.abs(this.Y[0] - this.Y[1]);

      // console.log(dy > dx)

      if (dy > dx)
      {
        return false;
      }
    }

    if (pageHolder.offset().left >= 0 || pageHolder.offset().left + pageHolder.width() - $(window).width() <= 0)
    {
      x = (touch.pageX - this.X[0])/2 + this.animOffsetX;
    }
    else
    {
      x = this.animOffsetX + touch.pageX - this.X[0];
    }

    // render
    pagesClass.setOffset(x);

    return true;
  }

  this.slideEnd = function (event)
  {
    var
      touch = event.originalEvent.changedTouches[0],  // one finger
      l = this.X.length + 1,
      timeStamp = new Date().getTime(),
      width = $(window).width(),
      offset = pagesClass.getOffset(),
      x_0 = offset.left,
      frac = x_0/pagesClass.getPageWidth(),
      page_x,
      v_0,
      sign,
      k = 1,
      h = 0.5,
      translate;

    // save finial points
    this.X.push(touch.pageX);
    this.T.push(event.timeStamp);

    // initial valocity
    v_0 = this.velocity();

    // direction
    sign = 1 - 2*(v_0 < 0);

    // scrolled of page
    page_x = 1*(sign > 0) + frac - Math.ceil(frac);

    // magnitude only
    page_x *= sign;
    v_0 *= sign;

    if (v_0*v_0 >= k*(h - Math.abs(page_x)) && offset.left < 0 && offset.right < 0)
    {
      // switch page
      this.animate(x_0, v_0, timeStamp, sign, 1 - page_x);
    }
    else
    {
      // go back
      this.animate(x_0, v_0, timeStamp, sign, -page_x);
    }
  }

  this.velocity = function ()
  {
    var
      numData = 6,
      l = this.X.length,
      start = l < numData ? 0 : l - numData,
      sum1 = 0,
      sum2 = 0,
      X = [],
      T = [],
      i,
      lqv;

    for (i in this.X)
    {
      X.push(this.X[i] - this.X[0]);
      T.push(this.T[i] - this.T[0]);
    }

    // if length is less than numData do not use last point
    if (l < numData)
    {
      X.pop();
      T.pop();
    }

    // sums
    for (i in X)
    {
      sum1 += X[i]*T[i];
      sum2 += T[i]*T[i];
    }

    // least square velocity
    lqv = sum1/sum2;

    // per second
    lqv *= 1000;

    // percentage of window
    lqv /= $(window).width();

    return lqv;
  }

  this.animate = function (x_0, v_0, timeStamp, sign, distance)
  {
    var 
      time = new Date().getTime(),
      width = $(window).width(),
      pageWidth = pagesClass.getPageWidth(),
      t_f = slideDuration,
      t = (time - timeStamp)/1000,
      pageIndex,

      A = 3*v_0/(t_f*t_f) - 6*distance/(t_f*t_f*t_f),
      B = -4*v_0/t_f + 6*distance/(t_f*t_f),
      x = x_0 + sign*(v_0*t + 1/2*B*t*t + 1/3*A*t*t*t)*width;

    if (t > t_f)
    {
      pageIndex = Math.abs(Math.round(x/pageWidth))

      // set page
      // pagesClass.setPage(pageIndex);

      var page = pagesClass.getPage(pageIndex);

      navigate.to(page.attr('id'), 'link')

      // finished
      this.x = 0;
    }
    else
    {
      // append offset
      pagesClass.setOffset(x);

      // recursion
      this.timeout = setTimeout(function ()
        {
          that.animate(x_0, v_0, timeStamp, sign, distance)
        },
        1000/fps
      );
    }
  }

  $(window).on('touchstart', function(event)
  {
    // triggered before touch move
    that.slideStart(event);
  });

  $(window).on('touchmove', function(event)
  {
    var test = that.sliding(event);

    console.log(test)


    if (test)
    { 
      // no device scrolling
      event.preventDefault();
    }
  })

  $(window).on('touchend', function(event)
  {
    that.slideEnd(event);
  });
}









// console.log(
    //   'clc;',
    //   'clf;',
    //   'hold on;',
    //   'X = [' + X + '];',
    //   'T =  [' + T + '];',
    //   'x = [' + X.slice(start) + '];',
    //   't =  [' + T.slice(start) + '];',
    //   "plot(T, X, '.-');",
    //   "plot(t, x, 'r.-');",
    //   "plot([t(1) t(" + X.slice(start).length + ")],[x(1) x(" + X.slice(start).length + ")] + x/t*[0 100]);",
    //   "plot([t(1) t(" + X.slice(start).length + ")],[x(1) x(" + X.slice(start).length + ")] + " + lqv + "*[0 100], 'r');",
    //   lqv,
    //   '; x/t'
    //   );
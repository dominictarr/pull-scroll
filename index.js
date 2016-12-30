var pull = require('pull-stream')
var Pause = require('pull-pause')

var next = 'undefined' === typeof setImmediate ? setTimeout : setImmediate
var buffer = Math.max(window.innerHeight * 2, 1000)

function isVisible (el) {
  var style = getComputedStyle(el)
  return style.display === 'none' || style.visibility === 'hidden'
}

//test wether element has an active scroll bar.
//(element needs to be visible for this to work)

function isScroll (el) {
  return el.scrollHeight != el.clientHeight
}

function isBottom (scroller, buffer) {
  var rect = scroller.getBoundingClientRect()
  var topmax = scroller.scrollTopMax || (scroller.scrollHeight - rect.height)
  return scroller.scrollTop >=
    + ((topmax) - (buffer || 0))
}

function isTop (scroller, buffer) {
  return scroller.scrollTop <= (buffer || 0)
}

function isFilled(content) {
  return (
    !isVisible(content)
    //check if the scroller is not visible.
   // && content.getBoundingClientRect().height == 0
    //and has children. if there are no children,
    //it might be size zero because it hasn't started yet.
//    &&
    && content.children.length > 10
    //&& !isVisible(scroller)
  )
}

function isEnd(scroller, buffer, top) {
  //if the element is display none, don't read anything into it.
  return (top ? isTop : isBottom)(scroller, buffer)
}

function append(scroller, list, el, top, sticky) {
  if(!el) return
  var s = scroller.scrollHeight
  if(top && list.firstChild)
    list.insertBefore(el, list.firstChild)
  else
    list.appendChild(el)

  //scroll down by the height of the thing added.
  //if it added to the top (in non-sticky mode)
  //or added it to the bottom (in sticky mode)
  if(top !== sticky) {
    var st = list.scrollTop, d = (scroller.scrollHeight - s) + 1
    scroller.scrollTop = scroller.scrollTop + (d + sdiff )
  }
}

function overflow (el) {

  return el.style.overflowY || el.style.overflow || (function () {
    var style = getComputedStyle(el)
    return style.overflowY || el.style.overflow
  })()
}

module.exports = function Scroller(scroller, content, render, top, sticky, cb) {
  //if second argument is a function,
  //it means the scroller and content elements are the same.
  if('function' === typeof content) {
    cb = sticky
    top = render
    render = content
    content = scroller
  }

  if(!cb) cb = function (err) { if(err) throw err }

  var f = overflow(scroller)
  if(!/auto|scroll/.test(f))
    throw new Error('scroller.style.overflowY must be scroll or auto, was:' + f + '!')
  scroller.addEventListener('scroll', scroll)
  var pause = Pause(function () {}), queue = []

  //apply some changes to the dom, but ensure that
  //`element` is at the same place on screen afterwards.

  function add () {
    if(queue.length) {
      var m = queue.shift()
      var r = render(m)
      append(scroller, content, r, top, sticky)
    }
  }

  function scroll (ev) {
    if(isEnd(scroller, buffer, top) || !isFilled(content)) {
      pause.resume()
      add()
    }
  }

  pause.pause()

  //wait until the scroller has been added to the document
  next(function next () {
    if(scroller.parentElement) pause.resume()
    else                       setTimeout(next, 100)
  })

  var stream = pull(
    pause,
    pull.drain(function (e) {
      queue.push(e)
      //we don't know the scroll bar positions if it's display none
      //so we have to wait until it becomes visible again.
      if(!isVisible(content)) {
        if(content.children.length < 10) add()
      }
      else if(!isScroll(scroller)) add()
      else if(isEnd(scroller, buffer, top)) add()

      if(queue.length > 5) pause.pause()
    }, function (err) {
      if(err) console.error(err)
      cb ? cb(err) : console.error(err)
    })
  )

  stream.visible = add
  return stream
}


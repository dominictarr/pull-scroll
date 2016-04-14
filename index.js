var pull = require('pull-stream')
var Pause = require('pull-pause')

function isBottom (scroller, buffer) {
  var topmax = scroller.scrollTopMax || (scroller.scrollHeight - scroller.getBoundingClientRect().height)
  return scroller.scrollTop >=
    + ((topmax) - (buffer || 0))
}

function isTop (scroller, buffer) {
  return scroller.scrollTop <= (buffer || 0)
}

function isEnd(scroller, buffer, top) {
  return (top ? isTop : isBottom)(scroller, buffer)
}

function append(list, el, top, sticky) {
  var s = list.scrollHeight
  if(top && list.firstChild)
    list.insertBefore(el, list.firstChild)
  else
    list.appendChild(el)

  //scroll down by the height of the thing added.
  //if it added to the top (in non-sticky mode)
  //or added it to the bottom (in sticky mode)
  if(top !== sticky) {
    var st = list.scrollTop, d = (list.scrollHeight - s) + 1
    list.scrollTop = list.scrollTop + d
//    list.scrollTo(
//      list.scrollLeft,
//      list.scrollTop + d
//    )
  }
}

function overflow (el) {
  return el.style.overflowY || el.style.overflow || (function () {
    var style = getComputedStyle(el)
    return style.overflowY || el.style.overflow
  })()
}

var buffer = 100
module.exports = function Scroller(scroller, render, top, sticky, cb) {
  var f = overflow(scroller)
  if(!/auto|scroll/.test(f))
    throw new Error('scroller.style.overflowY must be scroll or auto, was:' + f + '!')
  scroller.addEventListener('scroll', scroll)
  var pause = Pause(function () {}), queue = []

  //apply some changes to the dom, but ensure that
  //`element` is at the same place on screen afterwards.

  function add () {
    if(queue.length)
      append(scroller, render(queue.shift()), top, sticky)
  }

  function scroll (ev) {
    if (isEnd(scroller, buffer, top)) {
      pause.resume()
      add()
    }
  }

  return pull(
    pause,
    pull.drain(function (e) {
      queue.push(e)
      if(isEnd(scroller, buffer, top)) add()
      if(queue.length > 5) pause.pause()
    }, function (err) {
      if(err) console.error(err)
      cb ? cb(err) : console.error(err)
    })
  )
}




var pull = require('pull-stream')
var Pause = require('pull-pause')

var next = 'undefined' === typeof setImmediate ? setTimeout : setImmediate
var buffer = Math.max(window.innerHeight * 2, 1000)

var u = require('./utils'),
  assertScrollable = u.assertScrollable,
  isEnd = u.isEnd,
  isFilled = u.isFilled,
  isVisible = u.isVisible,
  isScroll = u.isScroll

module.exports = Scroller

function Scroller(scroller, content, render, isPrepend, isSticky, cb) {
  assertScrollable(scroller)

  //if second argument is a function,
  //it means the scroller and content elements are the same.
  if('function' === typeof content) {
    cb = isSticky
    isPrepend = render
    render = content
    content = scroller
  }

  if(!cb) cb = function (err) { if(err) throw err }

  scroller.addEventListener('scroll', scroll)
  var pause = Pause(function () {})
  var queue = []

  //apply some changes to the dom, but ensure that
  //`element` is at the same place on screen afterwards.

  function add () {
    if(queue.length) {
      var m = queue.shift()
      var r = render(m)
      append(scroller, content, r, isPrepend, isSticky)
    }
  }

  function scroll (ev) {
    if(isEnd(scroller, buffer, isPrepend) || !isFilled(content)) {
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
      if(queue.length > 5) pause.pause()

      if(scroller.scrollHeight < window.innerHeight)
        add()

      if (!isVisible(content)) return
      if(!isScroll(scroller) || isEnd(scroller, buffer, isPrepend))
        add()

    }, function (err) {
      if(err) console.error(err)
      cb ? cb(err) : console.error(err)
    })
  )

  stream.visible = add
  return stream
}


function append(scroller, list, el, isPrepend, isSticky) {
  if(!el) return
  var s = scroller.scrollHeight
  if(isPrepend && list.firstChild)
    list.insertBefore(el, list.firstChild)
  else
    list.appendChild(el)

  //scroll down by the height of the thing added.
  //if it added to the top (in non-sticky mode)
  //or added it to the bottom (in sticky mode)
  if(isPrepend !== isSticky) {
    var d = (scroller.scrollHeight - s) + 1
    scroller.scrollTop = scroller.scrollTop + d
  }
}


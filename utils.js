
function assertScrollable(scroller) {
  var f = overflow(scroller)
  if(!/auto|scroll/.test(f))
    throw new Error('scroller.style.overflowY must be scroll or auto, was:' + f + '!')
}

function isEnd(scroller, buffer, isPrepend) {
  //if the element is display none, don't read anything into it.
  return (isPrepend ? isTop : isBottom)(scroller, buffer)
}

function isFilled(content) {
  return (
    !isVisible(content)
    //check if the scroller is not visible.
    // && content.getBoundingClientRect().height == 0
    //and has children. if there are no children,
    //it might be size zero because it hasn't started yet.
    && content.children.length > 10
    //&& !isVisible(scroller)
  )
}

function isVisible (el) {
  var style = getComputedStyle(el)
  return style.display === 'none' || style.visibility === 'hidden'
}

//test wether element has an active scroll bar.
//(element needs to be visible for this to work)

function isScroll (el) {
  return el.scrollHeight != el.clientHeight
}


module.exports = {
  assertScrollable: assertScrollable,
  isEnd: isEnd,
  isFilled: isFilled,
  isVisible: isVisible,
  isScroll: isScroll
}


// 'private' functions

function overflow (el) {
  return el.style.overflowY || el.style.overflow || (function () {
    var style = getComputedStyle(el)
    return style.overflowY || el.style.overflow
  })()
}

function isTop (scroller, buffer) {
  return scroller.scrollTop <= (buffer || 0)
}

function isBottom (scroller, buffer) {
  var rect = scroller.getBoundingClientRect()
  var topmax = scroller.scrollTopMax || (scroller.scrollHeight - rect.height)
  return scroller.scrollTop >=
    + ((topmax) - (buffer || 0))
}



//detect when the user is not scrolling.

var requestAnimationLoop = require('request-animation-loop').requestAnimationLoop
module.exports = function velocity (element, onStopped) {
  var velocity = 0, _scrollY = window.scrollY

  return requestAnimationLoop(function () {
    velocity = window.scrollY - _scrollY
    _scrollY = window.scrollY
    if(velocity === 0) onStopped()
  })
}


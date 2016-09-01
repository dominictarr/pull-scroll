var Scroller = require('../')
var pull = require('pull-stream')
var h = require('hyperscript')

var content = h('div')
var scroller = h('div', {
    style: {
      //must set overflow-y to scroll for this to work.
      'overflow-y': 'scroll',
      //and cause this element to not stretch.
      //this can also be achived using flexbox column.
      position: 'fixed', bottom:'0px', top: '0px',
      'margin-left': 'auto',
      'margin-right': 'auto',
      width: '600px'
    }
  }, content)

  //provide a render function that returns an html element.
  function render (n) {
    return h('h1', n.toString())
  }

  pull(
    pull.infinite(),
    Scroller(scroller, content, render)
  )

document.body.appendChild(scroller)









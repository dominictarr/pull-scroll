var h = require('hyperscript')
var o = require('observable')
var pull = require('pull-stream')
var Pause = require('pull-pause')

var Scroller = require('../')

var c = o.value()
var v = o.value()

var check = h('input', {type: 'checkbox'})
var sticky = o.input(check, 'checked')
var panel
document.body.appendChild(
  panel = h('div.screen', {
    style: {
      top: '0px', bottom: '0px',
      position: 'absolute',
      display: 'flex',
      'flex-direction': 'row'
    }
  },
    h('div', {style: {position: 'fixed', right: '20px', top: '20px'}},
      c, '-', v, check, 
      h('a', 'Create!', {href: '#', onclick: function () {
        panel.appendChild(createScroller())
      }})
    )
  )
)

//load below the screen bottom, so that normal reading is jankless.

//user provided source stream
function createSource (top) {
  return pull(
    pull.infinite(),
    pull.map(function (e) {
      c((c()||0)+1)
      return {random: e, count: c(), top: top}
    }),
    pull.asyncMap(function (e, cb) {
      var delay = 100 + 200*Math.random()
      setTimeout(function () {
        e.delay = delay
        cb(null, e)
      }, delay)
    })
  )
}

function render (e) {
  return h('h3', {
    style: {background: 'hsl('+Math.round(Math.random()*360) + ',100%,50%)'
    }
  }, h('pre', JSON.stringify(e, null, 2)))
}

function createScroller () {
  var scroller = SCROLLER = h('ol', {
    style: {
      'flex-bias': 0,
      overflowY: 'scroll',
      overflow: 'auto',
      display: 'inline-block'
    }
  })

  pull(
    createSource(true),
    Scroller(scroller, render, true, false)
  )

  pull(
    createSource(false),
    Scroller(scroller, render, false, false)
  )

  return h('div', {style: {
    display: 'flex', 'flex-bias': 0,
    'flex-direction': 'column'
    }}, h('h1', 'scroller') , scroller)
}



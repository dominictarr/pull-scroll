# pull-scroll

pull-stream to a infinite scrolling web pane.

streams are for programatically dealing with data that
arrives or is processed over time. Many applications
also have features they call "streams", or views
that may contain a large number of items,
if you just keep scrolling down?

pull-scroll is the simplest way to join these concepts,
you can take a pull-stream of content, attach it to a
scrolling element, and the scroller sets the back pressure.

when the element is filled, back pressure kicks in,
and when you scroll to the end, it is released, and more data flows in.

pull-scroll can be used for both double and single ended content streams.

## example

``` js
var Scroller = require('pull-scroll')
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
```


## License

MIT






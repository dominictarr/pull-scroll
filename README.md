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

you can have attach two Scrollers to an element, one for scrolling up
and one for scrolling down. (thus, a two way infinite scroller)

see [example here](https://github.com/dominictarr/patchbay/blob/master/modules/public.js#L24-L32)

## api

### Scroller(scrollable, container, render, isPrepend, isSticky, cb) => Sink

Create a pull-stream sink where the back pressure is controlled by the scrolling of the element.
`scrollable` needs to be an element which can scroll, and `container`
is an optional child (otherwise elements will be added directly to `scrollable`)

`render` is a function that takes stream items and returns an html element.

If `isPrepend` is true, elements will be added before the first child of container,
if it is false, they will be appended.

If `isSticky` is true, `scrollable` will be scrolled into position after adding an element.
this will make more elements come automatically, untill you scroll away.
If `isSticky` is false, new elements will extend the container, but not be scrolled into positon,
this means the scroll will only be adjusted as the user scrolls.

If the user is scrolling to read old data (i.e. scrolling down on twitter, or up in the terminal)
then use `isSticky=false`. If the user is scrolled to the end to get new data,
(i.e. scrolling to the top on twitter, or the bottom in the terminal)
then use `isSticky=true`.

`cb` is an optional callback used only for error handling.
This defaults to
```js
function (err) { if(err) console.error(err) }
```

## License

MIT






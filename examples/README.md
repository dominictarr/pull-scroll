
# run examples in electron

```
npm install electron-prebuilt electro -g
electro examples/simple.js
```
[electro](https://github.com/dominictarr/electro) is my electron wrapper
that lets you just run a single js file and pipe to it via stdio.


# run examples in a browser via browserify

```
npm install browserify indexhtmlify -g

browserify examples/simple.js | indexhtmlify > index.html
```
then open that in your prefured web browser!

# Node.js Bar

<img src="https://raw.github.com/indutny/bar/master/bar.jpg" />

*Http-server goes into a bar*

# What is Node.js Bar?

Node.js Bar is a [node.js](http://node.js.org) framework for building large modular web applications.

# How does it work?

**Bar** can be run in any folder, all javascript files in that folder will be transformed to **drinkers** and then runned as a part of Node.js Bar. Bar have a **pool** full of drinks. Every drinker has a **pint** which is a merely the same thing as a **pool**, but smaller and with local features.
So in, basically, **pint** and **pool** are both the same [EventEmitter2](https://github.com/hij1nx/EventEmitter2) instance. Because of that, drinkers can communicate with each other by **emitting** and **listening** events.
At any time drinker can leave and enter **Bar**. That process is essentially the same as the **Module autoreload** process.

## Where can I run Bar?

As I said before, **Bar** can be run at any folder. You only need to have it installed globally using [npm](https://github.com/isaacs/npm)

# Installation

```
[sudo] npm install bar -g
```

# Documentation

## Drinker API

Every drinker can access **pool** methods: `on`, `emit`, `addListener`, `removeListener` and etc. They're exposed to global context (*Drinkers are running in separate contexts*).

```javascript
on('some-event', function() {
});

emit('some-event', someData = {a: 1});
```

Also `name`, `hook`, `snap` methods are exposed to global context.

## Name

Every drinker should introduce itself by calling `name`. Only letters, digits, underscores and hyphens can be used for a Drinker's name.

```javascript
name('your-drinker-name');
```

## Drinker events

At any time, when drinker's code was changed - Bar will immediately emit `leave.${drinker.name}` event and create new drinker to replace old one. All event handlers attached to Bar's **pool** will be removed before that.

```javascript
name('drinker-name');

on('leave.drinker-name', function() {
  // This method should act like destructor and detach/remove all data
  // Close all file descriptors opened by Drinker and etc.
});
```

## Hook&Snap

There're two method for building persistent relationships between two Drinkers: `hook` and `snap`. `snap` will pass arguments to `hook` callback regardless of the order in which they were called.

```javascript
name('hook');

hook('beer', function(from, amount) {
  // Do something with {amount} of beer
});
```

```javascript
name('snap');

snap('beer', 'Bob Smith', 10);
```

You should use `hook` and `snap` pattern to share objects between multiple drinkers.

## More info

To find more info look at examples.

#### Author: [Fedor Indutny](http://indutny.com/)


## Credits

Image by [Creatunco](http://creatunco.deviantart.com/)

#### LICENSE

This software is licensed under the MIT License.

Copyright Fedor Indutny, 2013.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.

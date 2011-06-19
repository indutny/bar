# Node.js Bar

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

Work on documentation is in progress.

#### Author: [Fedor Indutny](http://indutny.com/)

Super quick prototypes locally.

I like my server and app separated; I am an old curmudgeon of Apache/PHP :)

I'll generally use nodeenv and create an environment `nodeenv env --prebuilt`
so my directory structure looks like:
```
project
  - env
  - app
  - server
```

cd to the server directory (which contains this repo). I usually use `npm install -g .`

No go to the app directory and optionally create a `route.js` file.
Format is:
```
module.exports = [
  [function(req, res, next){}], // middleware
  ['/route', function(req, res, next){}] // basic route
]
```

If no match is found in the route.js file, then it will render a index.js file
from the app directory.

From the app directory run `server`

Changes to routes are dynamic meaning you can change on the fly and not restart
the server

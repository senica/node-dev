#!/usr/bin/env node

let fs = require('fs')

let express = require('express')
let app = express()
let ejs = require('ejs')

var cwd = process.cwd()

app.use(express.static(cwd))

var path_count // make a note of where to rewrite the router

app.use((req, res, next)=>{

  // I don't know if this will work with cached routes further in the app
  if(!path_count){
    path_count = app._router.stack.length
  }else{
    app._router.stack.splice(path_count) // this function isn't added till later, so we don't minus 1
  }

  // Might do policies here

  // Collect routes from the user
  let routes = `${cwd}/routes.js`
  if(fs.existsSync(routes)){
    delete require.cache[require.resolve(routes)]
    routes = require(`${cwd}/routes.js`);
  }else{
    routes = []
  }

  // This is the final route if nothing else matches
  // Might add this to our own route file
  routes.push([
    '*', (req, res, next)=>{
      let index = `${cwd}/index.js`
      index = fs.readFileSync(index, 'utf8')
      // Render should make some variables available to it
      res.send(ejs.render(index))
    }
  ])

  // Add the routes to the express router
  for(let i in routes){
    let [path, cb] = routes[i]

    // If the first element is a function, then use it as middleware
    if(typeof path === 'function')
      app.use(path)
    else{
      app.all(path, cb)
    }
  }

  // All the routes have been added, now let express run them
  next()

})

app.listen(3000, ()=>{
  console.log('listening on port 3000')
})

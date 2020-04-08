var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('views'));
app.use(express.static('node_modules/three/build'));
app.use(express.static(__dirname +'/node_modules/dat.gui/build'))

// listen for requests :)
var listener = app.listen(8080, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

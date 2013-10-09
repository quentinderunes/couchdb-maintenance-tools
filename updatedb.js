
var username = 'admin';
var userpass = 'daneel';
var host = 'localhost';


var nano = require('nano')('http://'+username+':'+userpass+'@'+host+':5984');

var db = nano.db.use('zerostress_users');
var views = require('./views/views.js');
var dbupdater = require('./classes/dbupdater.js')(db, views);

dbupdater.update();



// db.get('_design/v1.2d', { }, function(err, doc) {
// 	if (err) {
// 		console.error(err);
// 		return;
// 	}

// 	if (!err)
// 		console.log(doc.views);

	
// });

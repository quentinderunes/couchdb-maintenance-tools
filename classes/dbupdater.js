var dbupdater = function(db, views) {

	function getDesignDocs(views) {
		var p = '../views/';
		var docs = {};

		for(version in views) {
			var docId = version;
			var docViews = {};
			for(var i = 0; i < views[version].length; i++) {
				var viewPath = p+version+'/'+views[version][i]+'.js';

				try {
					var view = require(viewPath);
					docViews[views[version][i]] = view;
				}
				catch(e) {
					console.error(e);
				}
			}

			docs[docId] = docViews;

		}

		return docs;
	}

	return {
		update: function() {
			var designDocs = getDesignDocs(views);

			for(version in designDocs) {
				var docId = '_design/'+version;
				db.get(docId, {}, function(err, designDoc) {
					if (!designDoc) {
						designDoc = { language : 'javascript' };
					}
					designDoc.views = designDocs[version];

					db.insert(designDoc, docId, function(err, body) {
						if (err) {
							console.error('Design document ' + docId + ' could not be updated');
							console.error(err);
							return;
						}
						
						console.log('Design document ' + docId + ' updated');

					});
				});
			}
		}
	}
}

module.exports = dbupdater;
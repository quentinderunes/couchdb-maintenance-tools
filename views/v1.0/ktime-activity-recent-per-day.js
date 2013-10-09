module.exports = {
	map: function (doc) {
		if (!doc.data || !doc.events ) {
			return;
		}

		if (!doc.data.lastconnection) {
			return;
		}
		
		// Build data key with meta data

		var firstevent = doc.data.lastconnection;
		if (doc.events && doc.events.length > 0) {
			firstevent = doc.events[0].date;
		} 

		if (firstevent > (new Date()).getTime()) {
			return;
		}


		var refdate = new Date();
		var nowdate = refdate.getTime();
		refdate = refdate.getTime() - 1000 * 60 * 60 * 24 * 30;

		// Build data value
		var value = {};
		var level = null;
		var isFirst = true;
		for(i in doc.events) {
			var key = [firstevent];
			var e = doc.events[i];
			if (e.type != 'activity') {
				continue;
			}

			if (!e.date) {
				continue;
			}

			var d = new Date(e.date);
			d.setMilliseconds(0);
			d.setSeconds(0);
			d.setMinutes(0);
			d.setHours(0);

			value = [d.getTime(), 1, [d.getFullYear(), d.getMonth()+1, d.getDate()]];
			if (refdate > d.getTime() || nowdate < d.getTime()) {
				// value.push(1);
				continue;
			}

			key.push(d.getFullYear());
			key.push( d.getMonth()+1);
			key.push(d.getDate());
			key.push(doc._id);

			emit(key, value);
			isFirst = false;
		}

	},


	reduce: function(keys, values, rereduce) {


		if (!rereduce) {
			result = {} ;
			prevKey = [];		


			for(var i = 0; i < values.length; i++) {
				if (prevKey.join('+') == keys[i].join('+')) {
					continue;
				}



				if (!result[values[i][0]]) {
					result[values[i][0]] = 0;
				}
			
				result[values[i][0]]++;

				prevKey = keys[i]
			}


			return {dates: result, key: prevKey};
		}
		else {
			result = {} ;
			prevKey = [];	

			for(var i=0; i<values.length; i++)  {
				
				if (prevKey.join('+') == values[i].key.join('+')) {
					continue;
				}
					
				for (d in values[i].dates) {
					if (!result[d]) {
						result[d]=0;
					}

					result[d] += values[i].dates[d];
					
				}

				prevKey = values[i].key;
			}

			return {dates: result, key: prevKey};
		}
	}
}
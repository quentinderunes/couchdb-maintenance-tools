module.exports = {
	map: function (doc) {
		if (!doc.data) {
			return;
		}

		// Build data key with meta data
		var key = [];

		if (!doc.data.lastconnection) {
			return;
		}

		var firstevent = doc.data.lastconnection;
		if (doc.events && doc.events.length > 0) {
			firstevent = doc.events[0].date;
		} 

		if (firstevent > (new Date()).getTime()) {
			return;
		}

		key.push(firstevent);

		// Build data value
		var value = {};
		var level = null;
		var hasStartedLevel = false;
		if (doc.data.set) {

			for(s in doc.data.set) {
				level = s.split(/_/)[0];
				if (!value[parseInt(level)]) {
					value[parseInt(level)] = 0;
				}
				
				if (doc.data.set[s].finished)
					value[parseInt(level)] += doc.data.set[s].finished;
				else if (doc.data.set[s].percent || doc.data.set[s].percent == 0)
					value[parseInt(level)] += doc.data.set[s].percent / 100;

				if (value[parseInt(level)] > 0)
					hasStartedLevel = true;
			}
		}

		if (hasStartedLevel)
			emit(key, value);
	},


	reduce: function(keys, values, rereduce) {
		if (!rereduce) {
			result = {} ;
			total = 0;

			for(var i=0; i<values.length; i++)  {
				total++;
				
				for (l in values[i]) {
					if (!result[l]) 
						result[l] = [0, 0];

					if (!values[i][l]) 
						continue;

					result[l][0] += values[i][l];
					result[l][1]++;
				}
			}

			// for (l in result) {
			// 	result[l][0] = result[l][0] / result[l][1];
			// }
			return {total: total, levels: result};
		}
		else {
			result = {} ;
			total = 0;

			for(var i=0; i<values.length; i++)  {
				total += values[i].total;
				
				for (l in values[i].levels) {
					if (!result[l]) 
						result[l] = [0, 0];

					if (!values[i].levels[l]) 
						continue;

					// result[l][0] += values[i].levels[l][0] * values[i].levels[l][1];
					result[l][0] += values[i].levels[l][0];
					result[l][1] += values[i].levels[l][1];
				}
			}

			return {total: total, levels: result};
		}
	}
}
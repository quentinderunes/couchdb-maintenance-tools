module.exports = {
	map: function (doc) {
		if (!doc.data || !doc.events) {
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

		for(i=doc.events.length-1; i>=0; i--) {
			e = doc.events[i];

			if (e.type == 'practice') {
				emit(key, e);
				return;
			}
		}

		emit(key, 1);
	},

	reduce: function(keys, values, rereduce) {

		if (!rereduce) {
			result = {total:0, evals:0,levels:{}} ;

			for(var i=0; i<values.length; i++)  {
				result.total++;

				if (values[i] == 1) {
					continue;
				}
				result.evals++;

				for (l in values[i]) {


					if (l=='type' || l=='date') {
						continue;
					}
				

					if (!result.levels[l]) result.levels[l] = [0, 0];

					if (!values[i][l]) continue;
					result.levels[l][0] += values[i][l];
					result.levels[l][1]++;
				}
			}

			for (l in result.levels) {
				result.levels[l][0] = result.levels[l][0] / result.levels[l][1];
			}
			return result;
		}
		else {
			result = {total:0, evals:0,levels:{}} ;

			for(var i=0; i<values.length; i++)  {

				result.total += values[i].total;
				result.evals += values[i].evals;

				for (l in values[i].levels) {
					if (!result.levels[l]) result.levels[l] = [0, 0];

					if (!values[i].levels[l]) continue;
					result.levels[l][0] += values[i].levels[l][0] * values[i].levels[l][1];
					result.levels[l][1] += values[i].levels[l][1];
				}
			}

			for (l in result.levels) {
				result.levels[l][0] = result.levels[l][0] / result.levels[l][1];
			}
			return result;
		}
	}
}
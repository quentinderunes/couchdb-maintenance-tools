module.exports = {
	map: function (doc) {
		if (!doc.data ) {
			return;
		}

		// Build data key with meta data
		var key = [];
		var firstevent = doc.data.lastconnection;
		if (doc.events && doc.events.length > 0) {
			firstevent = doc.events[0].date;
		} 

		if (firstevent > (new Date()).getTime()) {
			return;
		}

		key.push(firstevent);

		if (!doc.data.lastconnection) {
			return;
		}

		if (!doc.data.challenge) {
			value = [];
		}
		else 
			value = doc.data.challenge;

		emit(key, value);
	},


	reduce: function(keys, values, rereduce) {

		if (!rereduce) {
			result = {total: 0, levels: {}} ;

			
			for (i=0; i<values.length; i++) {
				result.total++;
				v = values[i];

				if (v == 1) {
					continue;
				}

				for (l in v) {
					if (!result.levels[l]) {
						result.levels[l] = {successes: 0, failures: 0, highscore: 0, highscoretime: null};
					}
					
					if (v[l].success == 1) {
						result.levels[l].successes++;
						
						if (!result.levels[l].highscoretime || result.levels[l].highscoretime > v[l].highscoretime) {
							result.levels[l].highscoretime = v[l].highscoretime;
						}
					}
					else {
						result.levels[l].failures++;
					}

					if (result.levels[l].highscore < v[l].highscore) {
						result.levels[l].highscore = v[l].highscore;
					}
				}
			}

			return result;
		}
		else {
			result = {total: 0, levels: {}} ;

			for (i=0; i<values.length; i++) {
				v = values[i];

				result.total += v.total;

				for(l in v.levels) {
					if (!result.levels[l]) {
						result.levels[l] = {successes: 0, failures: 0, highscore: 0, highscoretime: null};
					}

					result.levels[l].successes += v.levels[l].successes;
					result.levels[l].failures += v.levels[l].failures;

					if (result.levels[l].highscore < v.levels[l].highscore) {
						result.levels[l].highscore = v.levels[l].highscore;
					}

					if (!result.levels[l].highscoretime || result.levels[l].highscoretime > v.levels[l].highscoretime) {
						result.levels[l].highscoretime = v.levels[l].highscoretime;
					}
				}

			}

			return result;
		}
	}
};
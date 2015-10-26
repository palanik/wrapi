var githubAPI = require('./github.api.js');

githubAPI.zen(function(err, response) {
	if (!err) {
		console.log('Chris says "' + response + '"');
	}
});

// Print Highest Contributor to node repo.
githubAPI.contributors('nodejs', 'node', function(err, response) {
	if (!err) {
		var highest = response.reduce(function (acc, v) {
				if (v.contributions > acc.contributions) {
					acc.login = v.login;
					acc.contributions = v.contributions;
				}
				return acc;
			},
			{contributions: -1}
		);
		githubAPI.user(highest.login, function(err, resp) {
			if (!err) {
				var name = resp.name ? resp.name : resp.login;
				console.log('Highest contributions to \'nodejs/node\' made by ' + name + '.');
				console.log('User ' + name + ' made ' + highest.contributions + ' contributions.');
			}
		});
	}

});
'use strict';

function nest(root, pathArray, val) {
  var last = pathArray.pop();
  var tail = pathArray.reduce(function (acc, a) {
      if (!(a in acc)) {
        acc[a] = {};
      }
      return acc[a];
    },
    root
  );

  // This path (or partial) was used earlier?
  if (typeof tail[last] === 'object') {
    var descendant = tail[last];
    tail[last] = val;
    Object.keys(descendant).forEach((k) => {
      tail[last][k] = descendant[k];
    });
    return;
  }

  tail[last] = val;
}

function isStream(stream) {
	return (stream !== null
      && typeof stream === 'object'
      && typeof stream.pipe === 'function');
};

function isStreamWritable(stream) {
	return (isStream(stream)
    && stream.writable !== false);
};

module.exports = {
  nest: nest,
  isStream: isStream,
  isStreamWritable: isStreamWritable
};

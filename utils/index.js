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

  tail[last] = val;
}

function isStream(stream) {
	return (stream !== null
      && typeof stream === 'object'
      && typeof stream.pipe === 'function');
};

function isStreamWritable(stream) {
	return (isStream(stream)
    && stream.writable !== false
    && typeof stream._write === 'function'
    && typeof stream._writableState === 'object');
};

module.exports = {
  nest: nest,
  isStream: isStream,
  isStreamWritable: isStreamWritable
};

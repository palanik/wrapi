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

module.exports = {
  nest: nest
};

module.exports.prettyTreePrint = (prefix, tail) => {
  var paramName = '';
  var handlers = this.handlers || {};
  var methods = Object.keys(handlers).filter(method => handlers[method] && handlers[method].handler);

  if (this.prefix === ':') {
    methods.forEach((method, index) => {
      var params = this.handlers[method].params;
      var param = params[params.length - 1];
      if (methods.length > 1) {
        if (index === 0) {
          paramName += param + ` (${method})\n`;
          return;
        }
        paramName += prefix + '    :' + param + ` (${method})`;
        paramName += index === methods.length - 1 ? '' : '\n';
      } else {
        paramName = params[params.length - 1] + ` (${method})`;
      }
    });
  } else if (methods.length) {
    paramName = ` (${methods.join('|')})`;
  }

  var tree = `${prefix}${tail ? '└── ' : '├── '}${this.prefix}${paramName}\n`;

  prefix = `${prefix}${tail ? '    ' : '│   '}`;
  const labels = Object.keys(this.children);
  for (var i = 0; i < labels.length - 1; i++) {
    tree += this.children[labels[i]].prettyPrint(prefix, false);
  }
  if (labels.length > 0) {
    tree += this.children[labels[labels.length - 1]].prettyPrint(prefix, true);
  }
  return tree;
};

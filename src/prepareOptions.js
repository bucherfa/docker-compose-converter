module.exports = function() {
  const options = require('../assets/options.json');
  for (const option of options) {
    switch (option.type) {
      case 'string': {
        option.type = String;
        break;
      }
      case 'number': {
        option.type = Number;
        break;
      }
      case 'boolean': {
        option.type = Boolean;
        break;
      }
    }
  }
  return options;
}

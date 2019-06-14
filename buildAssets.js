const fs = require('fs');
const { exec } = require('child_process');
exec('docker run --help', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }
  const lines = stdout.split('\n');
  const startIndex = lines.indexOf('Options:') + 1;
  // remove unwanted header lines
  for (let i = 0; i < startIndex; i++) {
    lines.shift();
  }
  // remove description only lines
  const wanted = [];
  for (let line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.charAt(0) === '-') {
      wanted.push(trimmedLine);
    }
  }
  const options = [];
  for (let line of wanted) {
    const parts = line.split(' ');
    const option = {};
    options.push(option);
    for (const part of parts) {
      if (part === '') {
        break;
      }
      if (part.startsWith('--')) {
        option.name = part.slice(2);
      } else if (part.startsWith('-')) {
        option.alias = part.charAt(1);
      } else {
        switch (part) {
          case 'ulimit':
          case 'map':
          case 'list': {
            option.type = 'string';
            option.lazyMultiple = true;
            break;
          }
          case 'bytes':
          case 'decimal':
          case 'uint16':
          case 'int': {
            option.type = 'number';
            break;
          }
          default: {
            option.type = 'string';
          }
        }
      }
    }
    if (option.type === undefined) {
      option.type = 'boolean'
    }
  }
  options.push({ name: 'target', defaultOption: true });
  fs.writeFile("assets/options.json", JSON.stringify(options, null, 2), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  });
});

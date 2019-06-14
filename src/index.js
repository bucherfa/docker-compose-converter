const commandLineArgs = require('command-line-args');
const prepareOptions = require('./prepareOptions');
const YML = require('js-yaml');

function dcc(input) {
  input = cleanUp(input);
  const dockerCommands = input.split('docker ');
  if (dockerCommands.length > 1) {
    dockerCommands.shift();
    const services = [];
    const names = [];
    for (const dockerCommand of dockerCommands) {
      services.push(convertToService(parseDockerCommand(dockerCommand.trim().split(' '))));
    }
    for (const service of services) {
      names.push(getServiceName(service, names));
    }
    const dc = { version: '3', services: {} };
    for (let i = 0; i < names.length; i++) {
      dc.services[names[i]] = services[i];
    }
    return YML.dump(dc);
  }
  return '';
}

// https://github.com/75lb/command-line-args/wiki/Implement-multiple-command-parsing-(docker-style)
function parseDockerCommand(inputArray) {
  inputArray.shift()
  return commandLineArgs(prepareOptions(), { argv: inputArray, stopAtFirstUnknown: true });
}

function convertToService(c) {
  const s = {};
  if (c.name) {
    s['container_name'] = c.name;
  }
  if (c.target) {
    s.image = c.target;
  }
  if (c.env) {
    s.environment = c.env;
  }
  if (c.volume) {
    s.volumes = c.volume;
  }
  if (c.publish) {
    s.ports = c.publish;
  }
  if (c.network) {
    s.networks = c.network;
  }
  if (c.restart) {
    s.restart = c.restart;
  }
  if (c._unknown) {
    s.command = `sh -c "${c._unknown.join(' ')}"`;
  }
  if (c.dns) {
    s.dns = c.dns;
  }
  if (c['dns-search']) {
    s['dns_search'] = c['dns-search'];
  }
  if (c['env-file']) {
    s['env_file'] = c['env-file'];
  }
  if (c.expose) {
    s.expose = c.expose;
  }
  if (c.init) {
    s.init = c.init;
  }
  if (c.label) {
    s.labels = c.label;
  }
  if (c.link) {
    s.links = c.link;
  }
  if (c['cap-add']) {
    s['cap_add'] = c['cap-add'];
  }
  if (c['cap-drop']) {
    s['cap_drop'] = c['cap-drop'];
  }
  if (c['cgroup-parent']) {
    s['cgroup_parent'] = c['cgroup-parent'];
  }
  if (c.device) {
    s.devices = c.device;
  }
  if (c.user) {
    s.user = c.user;
  }
  if (c['workdir']) {
    s['working_dir'] = c['workdir'];
  }
  if (c.hostname) {
    s.hostname = c.hostname;
  }
  if (c.ipc) {
    s.ipc = c.ipc;
  }
  if (c['mac-address']) {
    s['mac_address'] = c['mac-address'];
  }
  if (c.privileged) {
    s.privileged = c.privileged;
  }
  if (c['read-only']) {
    s['read_only'] = c['read-only'];
  }
  if (c['shm-size']) {
    s['shm_size'] = c['shm-size'];
  }
  if (c.tty) {
    s.tty = c.tty;
  }
  return s;
}

function getServiceName(service, names) {
  let name = 'service';
  if (service['container_name']) {
    name = service['container_name'];
  } else if (service.image) {
    const imageName = service.image.split(':')[0];
    const imageNameArray = imageName.split('/');
    if (imageNameArray.length > 1) {
      name = imageNameArray[1];
    } else {
      name = imageName;
    }
  }
  let index = 0;
  let combination = name;
  while (names.includes(combination)) {
    index += 1;
    combination = name + index;
  }
  return combination;
}

function cleanUp(string) {
  return removeBackslashes(removeWhitespaces(string)).trim();
}

function removeWhitespaces(string) {
  return string.replace(/\s+/g, ' ');
}

function removeBackslashes(string) {
  return string.replace(/\\\//g, "/");
}

module.exports = dcc;

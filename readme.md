# docker-compose Converter

Convert docker run/create commands to docker-compose.yml files.

[Online Demo](https://bucherfa.github.io/dcc-web/)

## Example

### Input

```bash
docker run -d \
  -v nextcloud:/var/www/html \
  nextcloud
docker run -d \
  -v db:/var/lib/mysql \
  mariadb
```

### Output

```yml
version: '3'
services:
  nextcloud:
    image: nextcloud
    volumes:
      - 'nextcloud:/var/www/html'
  mariadb:
    image: mariadb
    volumes:
      - 'db:/var/lib/mysql'
```

## Usage

### Install

```bash
npm install docker-compose-converter --save
```

### Include

```javascript
const dcc = require('docker-compose-converter');
const dockerRunCommands = `
docker run -d \
  -v nextcloud:/var/www/html \
  nextcloud
docker run -d \
  -v db:/var/lib/mysql \
  mariadb
`;
const dockercomposeyml = ddc(dockerRunCommands);
console.log(dockercomposeyml);
```

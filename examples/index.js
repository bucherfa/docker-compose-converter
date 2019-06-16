const dcc = require('../src/index');

const examples = [
  // https://github.com/linuxserver/docker-duplicati#docker
  'docker run -d -p 8080:80 nextcloud',
  // https://github.com/nextcloud/docker#persistent-data
  `docker run -d \
    -v nextcloud:/var/www/html \
    nextcloud
  docker run -d \
    -v db:/var/lib/mysql \
    mariadb`,
  // https://github.com/linuxserver/docker-duplicati#docker
  `docker create \
    --name=duplicati \
    -e PUID=1000 \
    -e PGID=1000 \
    -e TZ=Europe/London \
    -p 8200:8200 \
    -v /path/to/appdata/config:/config \
    -v /path/to/backups:/backups \
    -v /path/to/source:/source \
    --network dockernet \
    --restart unless-stopped \
    linuxserver/duplicati \
    bundle exec thin -p 3000`,
  ''
];

for (const example of examples) {
  console.log(dcc(example));
}

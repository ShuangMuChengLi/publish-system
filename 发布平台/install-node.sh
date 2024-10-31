unzip node-pack.zip
chmod 777 -R node-pack
cd node-pack
tar xf  ./node-v14.8.0-linux-x64.tar.xz
ln -sf $(pwd)/node-v14.8.0-linux-x64/bin/npm /usr/local/bin/
ln -sf $(pwd)/node-v14.8.0-linux-x64/bin/node /usr/local/bin/
ln -sf $(pwd)/forever-pack/node_modules/forever/bin/forever /usr/local/bin/
chmod 777 ./forever-pack/node_modules/forever/bin/forever

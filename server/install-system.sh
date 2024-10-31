unzip publish-system.zip
chmod 777 -R publish-system
cd publish-system
forever stop publish-system
forever --uid publish-system -a -l ~/.forever/publish-system.log start bin/www

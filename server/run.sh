forever stop publish-system
cd publish-system
forever --uid publish-system -a -l ~/.forever/publish-system.log start bin/www

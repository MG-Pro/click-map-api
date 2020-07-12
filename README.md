# click-map-api

```docker run -d --name watchtower --restart unless-stopped -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --cleanup --remove-volumes -i 30 --label-enable```

```docker run -d --name click-map-api -p 3000:3000 --restart unless-stopped --label=com.centurylinklabs.watchtower.enable=true mgcat/click-map-api```

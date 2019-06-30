# Shopify public app scaffold

This Project include two apps. Frontend is vue + webpack dev server. Then backend is express.

- Frontend Root folder is ./src
- Frontend Template folder is ./public
- Backend Root folder is ./srv

## Project setup
```
yarn install
```

### Development Vue App
```
yarn serve
```

### Start express in development mode
```
yarn express
```

### Start express in production mode
```
yarn express:run
```

## How to deploy?

For `Development` environment, You can use webpack dev server instead of using Nginx. You can configruation the dev server at `vue.config.js`.

For `Production` environment, You can use Nginx + Express + Static. Below is nginx config example.

## Nginx Config - Production

```sh
upstream express {
	server 127.0.0.1:3000;
}

server {
	listen 80;
	server_name example.com;
	root /path/to/your/dist/;

	# Forward to express
	location ^~ /api {
		# Rewrite the url
		rewrite ^/api/(.*)$ /$1 break;
		# Forwarding Host & IP
		proxy_set_header Host $host;
	    proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	    proxy_pass http://express;
	}

	location / {
		# Don't cache the file
		expires -1;
		add_header Pragma "no-cache";
        add_header Cache-Control "no-store, no-cache, must-revalidate, post-check=0, pre-check=0";

        try_files $uri $uri/ index.html = 404;
	}

	access_log /var/log/nginx/$host-access.log;
	#error_log /var/log/nginx/error.log;
}
```

### Customize configuration

For more configration reference with `vue.config.js`. See [Configuration Reference](https://cli.vuejs.org/config/).

For more configration reference with `Nginx`. See [Documentation](https://docs.nginx.com/)
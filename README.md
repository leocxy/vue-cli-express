# Shopify public app scaffold

This Project include two apps. Frontend is vue + webpack dev server. Then backend is express. Using NeDB as NOSQL.

![issues](https://img.shields.io/github/issues/leocxy/vue-cli-express.svg)
![license](https://img.shields.io/github/license/leocxy/vue-cli-express.svg)

### Structure

```sh
.
├── .env
├── .env.sample
├── .gitignore
├── README.md
├── babel.config.js
├── db # NeDB
│   ├── .gitignore
├── jest.config.js
├── package.json
├── public # Static File
│   ├── favicon.ico
│   └── index.html
├── src # Vue source files
│   ├── App.vue
│   ├── main.js
│   ├── pages
│   │   ├── index.vue
│   │   └── install.vue
│   ├── plugins
│   │   ├── axios.js
│   │   ├── index.js
│   │   ├── lodash.js
│   │   └── vuetify.js
│   ├── router
│   │   └── index.js
│   ├── store
│   │   └── index.js
│   └── utils
│       └── mixins.js
├── srv # Express files
│   ├── conf
│   │   ├── index.js
│   │   ├── nedb.js
│   │   └── session-auth.js
│   ├── index.js
│   └── router
│       ├── shop.js
│       └── shopify.js
├── tests # Jest Test
│   └── unit
│       ├── .eslintrc.js
│       ├── App.spec.js
│       └── Home.spec.js
├── vue.config.js
└── yarn.lock
```

## Project setup
```
yarn install
```

## Project config

Create a .env file and change it
```sh
cp .env.sample .env
vim .env
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

### Run Jest Testing
```
yarn test:unit
```

### Run Jest Testing with coverage
```
yarn test:unit --coverage
```

### Run Single File Testing
```
yarn test:unit tests/unit/App.spec.js
```

## How to deploy?

For `Development` environment, You can use webpack dev server instead of using Nginx. You can configruation the dev server at `vue.config.js`.

For `Production` environment, You can use Nginx + Express. Below is nginx config example.

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

For more information about `Vue testing`. See [Vue testing handbook](https://lmiller1990.github.io/vue-testing-handbook/simulating-user-input.html#a-real-world-example)
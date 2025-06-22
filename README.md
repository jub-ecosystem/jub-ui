# Jub UI application
  
  This project contains the web application built using Vue 3.
 


## Project Setup


```sh

npm install

```

  

### Compile and Hot-Reload for Development

  

```sh

npm run  dev

```

  

### Compile and Minify for Production

  

```sh

npm run  build

```

### Folder structure

This subsection describes the folder structure of the web applications, the following list briefly describes every folder:
 - Dockerfile: This file describe the docker image steps to build a nginx server to serve the html, css and js. 
- README.md: This file :) 
- index.html: The html file with all  
- package.json: This file is the heart of the nodejs project, it describes all the scripts and the mandatory dependencies
- public/: This folder contains all the images of the application
- src
	- App.vue : Root component of the vue project
	- assets: This folder contains the global css files
	- components: This folder contains the components  used in the web application 
	- main.js: The init javascript file to mount the Root component App.vue
	 - router: This folder contain all the logic of the routing of the web application
	- stores: This folder is temporaly  empty (because we dont need any state management)
	- views: this folder contain all the view components (pages).


## Deployment
1.  Build the docker image using the following command:
``` sh
docker build -f ./Dockerfile -t muyal-ui .
```
2. Run the docker container using the created docker image:
``` sh
docker run --name <container_name> -d -p <host_port>:<docker_port> jub-ui
```

Replace the placeholders <container_name> which represents the name of the virtual container, <host_port> represents the port of the host machine and the <docker_port> must be 80 port.

That's it, enjoy it.



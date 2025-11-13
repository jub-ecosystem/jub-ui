# Jub UI application
  
  This project contains the web application built using Vue 3.
 


## Project Setup


```sh

npm i

```

  

### Compile and Hot-Reload for Development

Before running the UI, you must deploy Jub API + Xolo (adjust the `.env` if you need).

**Note:** The first time you set up the environment, create the Docker volume for Xolo’s database:
> ```sh
> docker volume create xolo-db
> ```
This step is **only required once**. If the volume already exists, you can skip it.

Then run the backend deployment script:

```sh
chmod +x ./deploy.sh && ./deploy.sh
```
Then run the dev local server
``` sh
npm run dev

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

# 👤 Xolo Scope Management (One-Time Setup)

The **scope** defines a logical access boundary in Xolo.
This step **must be performed only once**, immediately after deploying Xolo and **before creating any users or licenses**.

Use any HTTP client (Postman, httpie, Insomnia, etc.) to make the request to the API endpoint:

```
POST http://<xolo_host>:<xolo_port>/api/v4/scopes
```

Example request body:

```json
{
  "name": "xolo"
}
```

> Replace `<xolo_host>` and `<xolo_port>` with the host and port where the Xolo service is running.

Once the scope is created, you can proceed with user creation.


# 👤 Xolo User Management Guide

This guide provides step-by-step instructions to create and manage users in **Xolo**, including user creation, scope assignment, and license generation.

```sh
chmod +x ./create_user.sh && ./create_user.sh <username> <password>
```
⚠️ You must deploy xolo service 


## Deployment
1.  Build the docker image using the following command:
	``` sh
	docker build -f ./Dockerfile -t jub-ui .
	```
2. Run the docker container using the created docker image:
	``` sh
	docker run --name <container_name> -d -p <host_port>:<docker_port> jub-ui
	```

Replace the placeholders <container_name> which represents the name of the virtual container, <host_port> represents the port of the host machine and the <docker_port> must be 80 port.

That's it, enjoy it.



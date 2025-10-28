# Jub UI application
  
  This project contains the web application built using Vue 3.
 


## Project Setup


```sh

npm i

```

  

### Compile and Hot-Reload for Development

Before you must deploy Jub API + Xolo (adjust the `.env` if you need)
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



# Xolo User Management Guide

This guide provides step-by-step instructions to create and manage users in **Xolo**, including user creation, scope assignment, and license generation.



---

## 👤 1. Create a User

⚠️ Warning: Role-Username Consistency Required for mictlanx-sync

For the proper functioning of mictlanx-sync, it is **mandatory** that the "role" attribute in the user creation payload must match the "username" value exactly. This means, for example, if "username" is "guest", then "role" must also be "guest".

**Endpoint:**

```
POST http://<xolo-hostname>:<xolo-port>/api/v4/users
```

**Request Body:**

```json
{
  "username": "guest",
  "first_name": "Ignacio",
  "last_name": "Castillo",
  "email": "jcastillo@cinvestav.mx",
  "password": "guestguest",
  "profile": "",
  "role": "guest"
}
```

---

## 🌐 2. Create a Scope

**Endpoint:**

```
POST http://<xolo-hostname>:<xolo-port>/api/v4/scopes
```


**Request Body:**

```json
{
  "name": "imss"
}
```

---

## 🔗 3. Assign Scope to User

**Endpoint:**

```
POST http://<xolo-hostname>:<xolo-port>/api/v4/scopes/assign
```

**Request Body:**

```json
{
  "name": "imss",
  "username": "guest"
}
```

**Header:**

```
Secret: <your-secret>
```

---

## 🔒 4. Create and Assign a License

**Endpoint:**

```
POST http://<xolo-hostname>:<xolo-port>/api/v4/licenses/
```

**Request Body:**

```json
{
  "username": "guest",
  "scope": "imss",
  "expires_in": "24h",
  "force": true
}
```

**Header:**

```
Secret: <your-secret>
```


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



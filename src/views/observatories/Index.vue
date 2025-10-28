<template>
 <v-layout class="rounded rounded-md">

    <v-app-bar :elevation="9" title="Observatorios">
     <template v-slot:prepend>
      <router-link to="/">
        <v-btn icon="mdi-arrow-left"></v-btn>
      </router-link>
    </template>
    <template v-slot:append>
        <!-- <v-btn icon="mdi-heart"></v-btn> -->

        <div class="mr-3">
        <v-btn class="mr-3" icon="mdi-account"></v-btn>
          <span >
            {{ user.first_name }} {{ user.last_name }}
          </span>
        </div>
        <v-btn v-show="!auth"  @click="on_login_click">Iniciar sesión</v-btn>
        <v-btn v-show="auth" @click="on_logout_click" icon="mdi-logout"></v-btn>

        <!-- <v-btn icon="mdi-dots-vertical"></v-btn> -->
    </template>
    </v-app-bar>


    <v-main class="d-flex" style="max-height:100vh; min-height: 300px;">
            
            <v-container class="" v-if="observatories.length >0">
              <v-row
                v-for="observatories in observatory_rows" 
                class="mb-6"
              >
      <v-col
            v-for="observatory in observatories"
            md="4"
      >
        <v-sheet class="pa-2 ma-2">
          <v-card
            :disabled="!auth"
            class="mx-auto"
            max-width="400"
           >
            <v-img
          :src="observatory['image_url']"
            height="200px"
            cover
            @click="on_observatory_click(observatory)"
            ></v-img>

            <v-card-title
            @click="on_observatory_click(observatory)"
            >
              {{ observatory["title"] }}  
            </v-card-title>

            <v-card-subtitle>
            {{ observatory["levels"]  }} {{ observatory["levels_desc"] }}
            <!-- 1,000 miles of wonder -->
            </v-card-subtitle>

                <v-card-actions>

          <v-rating
    hover
    :length="5"
    :size="32"
    active-color="primary"
  /> 
                <!-- <v-btn
                    color="orange-lighten-2"
                    variant="text"
                >
                    Explore
                </v-btn> -->

                <v-spacer></v-spacer>

                <v-btn
                    :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    @click="on_description_click"
                ></v-btn>
                </v-card-actions>

                <v-expand-transition>
                <div v-show="show">
                    <v-divider></v-divider>

                    <v-card-text>
                      {{ observatory["description"] }}
                    </v-card-text>
                </div>
                </v-expand-transition>
          </v-card>

    </v-sheet>
      </v-col>
    </v-row>

  </v-container>

  
  <v-container v-else class="d-flex flex-column align-center justify-center" style="height:600px;">
    <!-- <v-row> -->
    <div class="mb-3">
      <v-img src="/images/error-404.png" alt="NOT_FOUND" cover :width="100"></v-img>
    </div>
    <div>
      <p class="not-found-text">No hay ningún observatorio.</p>
    </div>
    <!-- </v-row> -->

  </v-container>
    <v-dialog
        v-model="xolo_dialog"
          fullscreen
          :scrim="false"
          transition="dialog-bottom-transition"
    >
        <v-card>
            <v-toolbar
              dark
              color="black"
            >
          <v-btn
            icon
            dark
            @click="xolo_dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Xolo: Autenticación por contraseña</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
          </v-toolbar-items>
        </v-toolbar>

        <v-list
          lines="two"
          subheader
        >
        </v-list>
        <v-container
        ma-0 pa-0 
        fluid
        style="width:600px;height:90vh"
        >
        <div
        style="height: 400px;">
        <p>Ingrese sus credenciales para continuar</p>
        <v-text-field
          v-model="username"
          color="black"
          label="Nombre de usuario"
          variant="underlined"
        ></v-text-field>

        <v-text-field
          v-model="password"
          color="black"
          type="password"
          label="Contraseña"
          variant="underlined"
        ></v-text-field>
        <v-btn
          :loading="xolo_loading"
          block
          color="black"
          @click="on_auth_click"
        >
          Iniciar sesión
        </v-btn>

        </div>
      </v-container>
        <v-footer
        class="justify-center bg-grey-lighten-4"
        >
        <p class="mr-3 footer-text-0">Powered by <b class="footer-text-1">Xolo</b></p>
        <v-img max-width="35px"  src="/images/xolo/logo.png">
        </v-img>
        

      </v-footer>
      </v-card>
    </v-dialog>

        <!-- <h1>INDEX</h1> -->
    </v-main>
  </v-layout>
</template>

<script setup>
// import router from '../../router';
import { onBeforeMount,onMounted,ref,computed,watchEffect } from 'vue';
import {useRoute,useRouter} from 'vue-router'

const router = useRouter()
const observatories = ref([])
const is_loading = ref(true)
const auth = ref(false) 
const initial_user = {"username":"Guest", "profile_photo":"","first_name":"Invitado","last_name":""}
const user = ref(initial_user)
const show = ref(false);
const username = ref("")
const password = ref("")
const xolo_loading = ref(false)
const xolo_dialog = ref(false)


const env       = import.meta.env.VITE_APP_OCA_ENV
const xolo_port = env == "dev" ? `:${import.meta.env.VITE_APP_XOLO_API_PORT}` : ""
const xolo_host = env == "dev" ? "localhost" : import.meta.env.VITE_APP_XOLO_API_IP_ADDR
const port      = env == "dev" ? `:${import.meta.env.VITE_APP_OCA_API_PORT}` : ""
const host      = env == "dev" ? "localhost" : import.meta.env.VITE_APP_OCA_API_IP_ADDR
const protocol  = env == "dev" ? "http" : "https"
      // / const host = "localhost"
      // const port = 5000
const max_columns = 3
const observatory_rows = computed(()=>{
  const n = observatories.value.length
  // console.log("N",n,"COMPUTED_OBS",observatories.value)
  if (n>0 ){
    const max_rows = Math.ceil(n/max_columns)
    // console.log("MAX_WORS",max_rows)
    if (max_rows <= 1) {
       return [ 
        observatories.value.map(x=>{
          const levels = x["catalogs"].length
          return { 
            "key":x["obid"],
            "title":x["title"],
            "description":x["description"],
            "levels":levels,
            "levels_desc":  levels > 1 ? "Niveles" : "Nivel",
            "image_url":x["image_url"]
          }
        } )  
      ]
    }else {
      const result = []
      for(let i =0; i<max_rows; i++) {
        const start_index = (i*(max_columns) )
        const end_index   = max_columns*(i+1)
        const observatories_per_row = observatories.value.slice(start_index,end_index).map(x=>{
          const levels = x["catalogs"].length
          return { 
            "key":x["obid"],
            "title":x["title"],
            "description":x["description"],
            "levels":levels,
            "levels_desc":  levels > 1 ? "Niveles" : "Nivel",
            "image_url":x["image_url"]
          }
        })
        console.log(observatories_per_row)
        result.push(observatories_per_row)
        // observatory_rows.value.push(observatories_per_row)
        // .concat(observatories_per_row)
      }
      console.log("RESULT",result)
      return result
      // return [observatories.value.map(x=>{

      //     return { "title":x["title"],"levels":x["catalogs"].length}
      // })]
    }
  }
  return []
})





const on_logout_click = async ()=> {
  auth.value=false
  localStorage.removeItem("access_token")
  localStorage.removeItem("secret")
  localStorage.removeItem("user.username")
  localStorage.removeItem("user.first_name")
  localStorage.removeItem("user.last_name")
  localStorage.removeItem("user.profile_photo")
  localStorage.removeItem("user.email")
  user.value=initial_user
  observatories.value=[]
}


const on_auth_click = async () =>{
  // console.log("SEND ",username.value, password.value)
  try {
    xolo_loading.value=true
    const body = JSON.stringify(
      {
        "username": username.value.trim(),
        "password": password.value.trim(),
    })
    // console.log(body)
    const response = await (fetch(`${protocol}://${xolo_host}${xolo_port}/api/v4/users/auth`,{
      method:"POST",
      body: body,
      headers: {"Content-Type":"application/json"}
    })) 

    if(response.status!= 200) {
      throw "Xolo: Incorrent username or password - 403 UNAUTHORIZED"
    }
    // if (response.status != 200){

    // }
    const data = await response.json()

    localStorage.setItem("user.username",data["username"] ?? "guest")
    localStorage.setItem("user.first_name",data["first_name"] ?? "Guest" )
    localStorage.setItem("user.last_name",data["last_name"] ?? "Guest")
    localStorage.setItem("user.email",data["email"] ?? "guest@test.com")
    localStorage.setItem("user.profile_photo",data["profile_photo"] ?? "https://www.eldersinsurance.com.au/images/person1.png?width=368&height=278&crop=1")
    localStorage.setItem("access_token",data["access_token"] ?? "ACCESS_TOKEN")
    localStorage.setItem("secret",data["temporal_secret"] ?? "SECRET")
    auth.value         = true
    xolo_loading.value = false
    xolo_dialog.value  = false;
    user.value         = data
    // It must show some notification. for now it is not important
    let obs = await get_observatories()
    observatories.value= obs
  } catch (error) {
    alert("Xolo: Incorrect username or password - UNAUTHORIZED")
    xolo_loading.value = false
    user.value         = initial_user
    auth.value         = false
  }
}



const on_login_click = ()=>{
  xolo_dialog.value = !xolo_dialog.value
}

const on_description_click = ()=>{

    if(auth.value){
      show.value =!show.value;
    }
}
const on_observatory_click = (o)=>{
    router.push(`/observatories/${o["key"]}`)
}

const get_observatories = async ()=>{
      try {
        console.log("Getting observatories...")

        user.value = {
          "username":localStorage.getItem("user.username"),
          "first_name":localStorage.getItem("user.first_name"),
          "last_name": localStorage.getItem("user.last_name"),
          "profile_photo": localStorage.getItem("user.profile_photo"),
        }
        auth.value=true


        const observatories_url = `${protocol}://${host}${port}/observatories`
        const obs = await fetch(observatories_url,{
          "credentials":"include",
          "method":"GET","headers":{"Content-Type":"application/json"}
        }).then(x=>x.json());
        
        console.log("OBSERVATORIES",obs)
        return obs
      // return 
      }catch (error) {
        return []
      }
}
onBeforeMount(async ()=>{
  try {

    const access_token = localStorage.getItem("access_token") ?? ""
    const secret = localStorage.getItem("secret") ?? ""
    const username = localStorage.getItem("user.username") ?? ""

    const body = JSON.stringify({
        "access_token":access_token,
        "username":username,
        "secret":secret,
    })
    const verify_response = await fetch(`${protocol}://${xolo_host}${xolo_port}/api/v4/users/verify`,{
        method:"POST",
        body:body,
      headers: {"Content-Type":"application/json"}
    })
    if (verify_response.status != 204 || access_token.length <=0 || access_token == "ACCESS_TOKEN" | secret.length <= 0 || secret=="SECRET"){
      console.error("Xolo: 403 UNAUTHORIZED")
      auth.value          = false
      xolo_dialog.value   = true
      observatories.value = []
      return
    }else{
      let obs = await get_observatories()
      observatories.value= obs
      is_loading.value=false
    }
  } catch (error) {
    alert(error)
  }
})
</script>
<style scoped>
.not-found-text{
  font-size: 24px;
}
.footer-text-0 {
  font-weight: lighter;
}
.footer-text-1 {
  font-weight: bold;
  color: rgb(87, 87, 87);
}
.test {
    background: blue;
    display: block;
    height: 100vh;
}
</style>
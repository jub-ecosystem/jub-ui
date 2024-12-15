<template>
  <v-layout class="rounded rounded-md">
    <!-- <v-app-bar title="Observatorios"></v-app-bar> -->
    <v-app-bar :elevation="1" :title="observatory['title']">
      <template v-slot:prepend>
        <router-link to="/observatories">
          <v-btn icon="mdi-arrow-left"></v-btn>
        </router-link>
      </template>
      <template v-slot:append>
        <v-btn icon="mdi-magnify" @click="on_search_click"></v-btn>

        <!-- <v-btn icon="mdi-magnify"></v-btn> -->

        <!-- <v-btn icon="mdi-dots-vertical"></v-btn> -->
      </template>
    </v-app-bar>

    <v-navigation-drawer width="400" v-model="left_drawer">
      <v-toolbar title="Filtros de búsqueda">
        <v-btn @click="on_left_drawer_click" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list v-if="!is_loading">
        <v-list-item class="mb-4">
          <v-item-group
            v-model="selected_view_type"
            selected-class="bg-primary"
          >
            <div class="text-caption mb-2">Tipo de vista</div>
            <v-item v-slot="{ selectedClass, toggle }">
              <v-chip
                prepend-icon="mdi-view-grid"
                :class="[selectedClass, 'mr-4']"
                @click="toggle"
              >
                Galeria
              </v-chip>
            </v-item>
            <v-item v-slot="{ selectedClass, toggle }">
              <v-chip
                prepend-icon="mdi-table"
                :class="selectedClass"
                @click="toggle"
              >
                Tabla
              </v-chip>
            </v-item>
          </v-item-group>
        </v-list-item>
        <v-list-item class="mb-4">
          <v-item-group
            v-model="selected_view_type"
            selected-class="bg-primary"
          >
            <div class="text-caption mb-2">Cantidad de productos</div>
            <v-item v-slot="{ selectedClass, toggle }">
              <!-- <div class="text-caption">Limite</div> -->
              <v-slider
                v-model="limit"
                color="primary"
                step="10"
                min="10"
                max="100"
                thumb-label
                show-ticks
              ></v-slider>
            </v-item>
          </v-item-group>
        </v-list-item>

        <v-list-item
          v-for="(catalog, index) in catalogs"
          :title="catalog['title']"
        >
          <div v-if="catalog['kind'] == 'INTEREST'">
            <v-select
              v-if="!manual_search"
              v-model="selectedValues[index]"
              clearable
              chips
              :menu-props="{ eager: true }"
              label="Selecciona un valor"
              :items="catalog['values']"
              return-object
            >
            </v-select>
            <v-autocomplete
              v-else
              label="Escribe un valor"
              v-model="selectedValues[index]"
              :items="catalog.values"
              return-object
            ></v-autocomplete>
          </div>
          <div v-else-if="catalog['kind'] == 'SPATIAL'">
            <v-select
              v-if="!manual_search"
              v-model="spatial_value"
              clearable
              chips
              :menu-props="{ eager: true }"
              label="Selecciona un valor"
              :items="catalog['values']"
              return-object
            >
            </v-select>
            <v-autocomplete
              v-else
              label="Escribe un valor"
              v-model="spatial_value"
              :items="catalog.values"
              return-object
            ></v-autocomplete>
          </div>
          <div class="d-flex" v-else-if="catalog['kind'] == 'TEMPORAL'">
            <v-number-input
              control-variant="stacked"
              :max="2024"
              :min="1970"
              v-model="temporal_min_value"
              :model-value="temporal_min_value"
            >
            </v-number-input>
            <v-number-input
              control-variant="stacked"
              :max="2024"
              :min="1970"
              v-model="temporal_max_value"
              :model-value="temporal_max_value"
            >
            </v-number-input>
          </div>
          <!-- <template v-slot:item="{ item }">
                {{ item.text }}
            </template> -->
        </v-list-item>
        <v-checkbox
          label="Búsqueda manual"
          v-model="manual_search"
        ></v-checkbox>
        <v-list-item>
          <v-btn
            @click="find_products_on_click"
            class="full-width"
            variant="flat"
            color="primary"
            size="large"
            >Buscar</v-btn
          >
        </v-list-item>
      </v-list>
      <div v-else>
        <v-progress-linear
          indeterminate
          color="primary-darken-2"
        ></v-progress-linear>
      </div>
    </v-navigation-drawer>

    <v-main
      class="d-flex align-center justify-center"
      style="max-height: 1000px; min-height: 300px"
    >
      <!-- <v-main class="d-flex align-center justify-center" style="max-height:1000px; min-height: 300px;"> -->

      <v-carousel
        v-if="selected_view_type == 0 && products.length > 0"
        v-model="current_product_index"
        @change="on_carousel_change"
        height="650px"
        show-arrows="hover"
      >
        <v-carousel-item v-for="product in products" cover>
          <div class="d-flex justify-center iframe-full">
            <iframe
              :src="`${product.url}`"
              width="100%"
              height="120%"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
          <!-- :src="`https://alpha.tamps.cinvestav.mx/mictlanx/${product.key}`" -->
        </v-carousel-item>
      </v-carousel>

      <div v-else-if="selected_view_type == 1 && products.length > 0">
        <v-data-table
          v-if="!main_is_loading"
          :headers="headers"
          :items="products"
        >
          <template v-slot:item="{ item }">
            <tr @click="on_click_product(item)">
              <td>{{ item.product_name }}</td>
              <td>{{ item.profile }}</td>
              <td>
                <v-icon
                  size="small"
                  class="me-2"
                  @click="on_show_product_click(item)"
                >
                  mdi-eye
                </v-icon>
                <v-icon
                  size="small"
                  class="me-2"
                  @click="on_download_product_click(item)"
                >
                  mdi-cloud-download
                </v-icon>
              </td>
              <!-- <td>{{ item.profile }}</td> -->
            </tr>
          </template>
          <template v-slot:item.actions="{ item }"> </template>
        </v-data-table>
        <div v-else>
          <span>Buscando productos...</span>
          <v-progress-linear
            indeterminate
            color="primary-darken-2"
          ></v-progress-linear>
        </div>

        <v-dialog v-model="dialog" fullscreen>
          <!-- :src="`https://alpha.tamps.cinvestav.mx/mictlanx/${current_product.key}`" -->
          <v-card>
            <v-card-text>
              <!-- Texto -->
              <div class="d-flex justify-center iframe-full">
                <iframe
                  class="iframe-full"
                  :src="`${MICTLANX_URL}/${current_product.pid}`"
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                @click="dialog = false"
                block
                variant="flat"
                color="red"
                prepend-icon="mdi-close-octagon-outline"
              >
                <template v-slot:prepend>
                  <v-icon color="error"></v-icon>
                </template>

                Cerrar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <div
        class="d-flex flex-column justify-center align-center"
        style="height: 600px"
        v-else
      >
        <div
          class="d-flex flex-column justify-center align-center"
          v-if="!main_is_loading"
        >
          <img src="/images/no_products.png" alt="NO_PRODUCTS" width="200" />
          <span>Ningún producto que coincida con su consulta.</span>
        </div>
        <div class="d-flex justify-center align-center flex-column" v-else>
          <v-progress-circular color="primary" indeterminate size="64">
          </v-progress-circular>
          Cargando...
        </div>
      </div>
    </v-main>

    <v-overlay
      persistent
      :model-value="observatory_not_found"
      class="align-center justify-center"
    >
      <div class="d-flex flex-column align-center">
        <div>
          <v-progress-circular color="primary" indeterminate size="64">
          </v-progress-circular>
        </div>
        <div>
          <span class="not_found_overlay_text">
            Redirecciónado al indice de observatorios...
          </span>
        </div>
      </div>
    </v-overlay>

    <v-navigation-drawer
      v-if="observatory_not_found"
      location="right"
      width="600"
      v-model="right_error_drawer"
    >
      <v-toolbar title="Notificaciones">
        <v-btn @click="on_error_right_drawer_click" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-list-item title="">
          <v-alert
            closable
            v-model="not_found_observatory_alert"
            color="error"
            icon="$error"
            title="Opps! El Observatorio No Existe"
            text="Por favor ingrese un identificador de observatorio valido y asegurese de tener una sesión inicidada en Xolo."
          >
          </v-alert>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-else
      location="right"
      width="600"
      v-model="right_drawer"
    >
      <v-toolbar title="Descripción del producto">
        <v-btn @click="on_right_drawer_click" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-list-item title=""> </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-layout>
</template>

<script setup>
import {
  onBeforeMount,
  onMounted,
  ref,
  computed,
  watchEffect,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
// const user = ref({});
const router = useRouter();
const $route = useRoute();
const temporal_min_value = ref(1970);
const temporal_max_value = ref(2024);
const catalogs = ref([]);
const spatial_value = ref();
const __catalogs = ref([]);
const observatory = ref({});
const selectedValues = ref([]);
const products = ref([]);
const left_drawer = ref(true);
const right_drawer = ref(false);
const should_render_products = ref(false);
const current_product = ref(null);
const current_product_index = ref(0);
const observatory_not_found = ref(false);
const right_error_drawer = ref(false);
const not_found_observatory_alert = ref(true);
// const redirect_overlay = ref(true);
const skip = ref(0);
const limit = ref(25);
const on_error_right_drawer_click = () => {
  right_drawer.value = false;
};

const selected_view_type = ref(0);
const show_list = ref(true);
const dialog = ref(false);
const manual_search = ref(false);
const is_loading = ref(true);
const main_is_loading = ref(false);
const headers = ref([
  {
    title: "Nombre",
    align: "start",
    sortable: false,

    key: "product_name",
  },

  // {
  //     title:"Description",
  //     align:"start",
  //     sortable:false,
  //     key:"description"
  // },
  {
    title: "Perfil",
    align: "start",
    sortable: false,
    key: "profile",
  },
  { title: "Acciones", key: "actions", sortable: false },
]);

const protocol = import.meta.env.VITE_APP_OCA_API_PROTOCOL;
const MICTLANX_URL = import.meta.env.VITE_MICTLANX_URL;
const env = import.meta.env.VITE_APP_OCA_ENV;
const port = env == "dev" ? `:${import.meta.env.VITE_APP_OCA_API_PORT}` : "";
const host =
  env == "dev" ? "localhost" : import.meta.env.VITE_APP_OCA_API_IP_ADDR;
const xolo_port =
  env == "dev" ? `:${import.meta.env.VITE_APP_XOLO_API_PORT}` : "";
const xolo_host =
  env == "dev" ? "localhost" : import.meta.env.VITE_APP_XOLO_API_IP_ADDR;
const base_url = `${protocol}://${host}${port}`;

// console.log("BASE_URL",base_url)
// console.log("HOST",host)
// console.log("PORT",port)
// console.log("PROTOCOL",protocol)
// console.log("BASE_URL",base_url)
const on_click_product = (item) => {
  // console.log(-"PRODUCT_CLCIK", item)
  // console.log("OBID",observatory)
  const obid = observatory.value.obid;
  router.push(`/observatories/${obid}/products/${item.pid}`);
};
const closeErrorAlert = (toggle) => {
  //console.log("BEFORE_CLOSE ALERT")
  toggle();
  //console.log("CLOSE ALERT")
};
const on_right_drawer_click = () => {
  right_drawer.value = false;
};
const on_left_drawer_click = () => {
  left_drawer.value = false;
};
const click_on_product = (product) => {
  window.open(product, "_blank");
};
const on_carousel_change = () => {
  // console.log("CAROUSEL_CHANGE")
};

const on_search_click = () => {
  // if(left_drawer != left_drawer) {
  left_drawer.value = true;
  // }
  // if(right_drawer!= t_drawer) {
  // right_drawer.value=true
  // }
};
const on_show_product_click = (item) => {
  dialog.value = true;
  current_product.value = item;
  // dialogs.value[item.key] = true

  // console.log("INDEX",index)
};
const on_download_product_click = (item) => {
  // window.open(`https://alpha.tamps.cinvestav.mx/mictlanx/${item.key}`,"_blank")
  // window.open(`${MICTLANX_URL}/${item.pid}`,"_blank")
  window.open(item.url, "_blank");
};
const get_icon = (kind) => {
  if (kind.includes("reports")) {
    return "mdi-table";
  } else if (kind.includes("maps")) {
    return "mdi-map";
  } else {
    return "mdi-chart-scatter-plot";
  }
};
const find_products_on_click = async () => {
  // const query_params=""
  try {
    // console.log(selectedValues.value)
    products.value = [];
    main_is_loading.value = true;
    const xs = selectedValues.value
      .filter((y) => {
        // console.log(y,y!==null)
        return y !== null;
      })
      .map((z) => {
        // console.log(z.item)
        return { value: z.item.value };
      });
    // .join(",")
    // console.log("X",x)

    const observatory_id = $route.params.observatory_id;
    // const port = import.meta.env.VUE_APP_OCA_API_PORT
    // console.log("HOST",host,"PORT",port)

    const url = `${base_url}/observatories/${observatory_id}/products/nid?skip=${skip.value}&&${limit.value}`;
    // const url   = `${base_url}/products/filter?levels=${x}&tags=${observatory_id}`
    // console.log("URL",url)
    // console.log("SELECTED",xs)
    // console.log("INTEREST",xs)
    console.log(spatial_value.value);
    console.log(xs);
    console.log(temporal_max_value, temporal_min_value);
    const query_body = {
      interest: xs,
      temporal: {
        low: temporal_min_value.value,
        high: temporal_max_value.value,
      },
      // "spatial":{
      //     "country":"*",
      //     "state":selected_spatial_value,
      //     "municipality":"*"
      // }
    };
    if (spatial_value.value != undefined) {
      const selected_spatial_value = spatial_value.value.item.value;
      query_body["spatial"] = {
        country: "*",
        state: selected_spatial_value,
        municipality: "*",
      };
    }
    // _________________________________________

    // console.log("BODY",query_body)
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query_body),
    }).then((x) => x.json());
    const sliced = response.slice(skip.value, limit.value);
    console.log("SLICED", sliced);
    products.value = sliced;
    main_is_loading.value = false;
  } catch (error) {
    console.log(error);
    main_is_loading.value = false;
  } finally {
    main_is_loading.value = false;
  }
};

onBeforeMount(async () => {
  const observatory_id = $route.params.observatory_id;
  try {
    const access_token = localStorage.getItem("access_token") ?? "";
    const secret = localStorage.getItem("secret") ?? "";
    const username = localStorage.getItem("user.username") ?? "";
    // const username_predicate = username.length <= 0 || username=="USERNAME" ||
    if (
      access_token.length <= 0 ||
      (access_token == "ACCESS_TOKEN") | (secret.length <= 0) ||
      secret == "SECRET"
    ) {
      router.push("/observatories");
    }

    const body = JSON.stringify({
      access_token: access_token,
      username: username,
      secret: secret,
    });
    // console.log(body)
    const XOLO_VERIFY_URL = `${protocol}://${xolo_host}${xolo_port}/api/v4/users/verify`;
    // console.log("XOLO_RLVRERYF",XOLO_VERIFY_URL)
    const verify_response = await fetch(XOLO_VERIFY_URL, {
      method: "POST",
      body: body,
      headers: { "Content-Type": "application/json" },
    });

    // console.log(verify_response,verify_response.status)
    if (verify_response.status != 204) {
      router.push("/observatories");
    }
    // console.log(verify_response)

    const GET_OBSERVATORY_URL = `${base_url}/observatories/${observatory_id}`;
    // console.log("GET_OURL", GET_OBSERVATORY_URL)
    const observatory_response = await fetch(GET_OBSERVATORY_URL).then((x) =>
      x.json()
    );
    // console.log("RESPONSE",observatory_response)
    observatory.value = observatory_response;
    const catalogs_objects = observatory_response["catalogs"];

    const _catalogs = [];
    for (let i = 0; i < catalogs_objects.length; i++) {
      const catalog = catalogs_objects[i];
      // console.log("Catalog",catalog)
      const catalog_response = await fetch(
        `${base_url}/catalogs/${catalog["cid"]}`
      ).then((x) => x.json());
      // console.log("CATALOG_RESPONSE",catalog_response)
      _catalogs.push(catalog_response);
    }
    // console.log(_catalogs)
    __catalogs.value = Object.freeze(_catalogs);
    catalogs.value = Object.freeze(
      __catalogs.value.map((x) => {
        const items = x["items"];
        const values = items.map((item) => {
          return {
            value: item["name"],
            title: item["display_name"],
            item: item,
          };
        });
        // console.log("X",x["kind"])
        return {
          title: x["display_name"],
          values: values,
          kind: x["kind"],
        };
      })
    );
    is_loading.value = false;
  } catch (error) {
    right_error_drawer.value = true;
    observatory_not_found.value = true;
    alert(`${observatory_id} not found ${error}`);
    // router.push("/observatories")
  }
});

watch(observatory_not_found, () => {
  // console.log("HAS CHANGED", observatory_not_found.value)
  setTimeout(() => {
    // console.log("REEEEEEEEEEEEEEEEEIRECTTT!")
    router.push("/observatories");
  }, 1500);
});
</script>
<style scoped>
.not_found_overlay_text {
  color: white;
  font-size: 24px;
}
.iframe-full {
  width: 100%;
  height: 100%;
}
.full-width {
  width: 100%;
}
.test {
  background: blue;
  display: block;
  height: 100vh;
}
</style>

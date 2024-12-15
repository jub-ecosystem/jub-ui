<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar app>
      <template v-slot:prepend>
        <v-img
          @click="router.push('/observatories')"
          src="/images/oca_2.png"
          alt="Logo"
          width="50"
          class="mr-1 ml-4 clickable"
        ></v-img>
      </template>
      <v-app-bar-title>OCA Panels</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <div
          v-for="(products, productType) in groupedProducts"
          :key="productType"
        >
          <h2>{{ productType }}</h2>
          <v-carousel cycle height="800">
            <v-carousel-item v-for="(product, index) in products" :key="index">
              <div class="product-item">
                <h3>{{ product.product_name }}</h3>
                <p>
                  URL:
                  <a target="_blank" :href="product.url">{{ product.url }}</a>
                </p>
              </div>
              <iframe
                :src="product.url"
                width="100%"
                height="100%"
                frameborder="0"
              ></iframe>
            </v-carousel-item>
          </v-carousel>
        </div>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const overlay = ref(false);
const loading = ref(false);
const router = useRouter();
const route = useRoute();
// const x = reactive({ sv: "*", tv: "*", iv: "*", pt: "*" });
// const observatory_id = "retcpuebla"; //$route.params.observatory_id
// const port = import.meta.env.VUE_APP_OCA_API_PORT
// console.log("HOST",host,"PORT",port)
const port = "";
// const host = "alpha.tamps.cinvestav.mx/ocapi"
// const host = "onca.tamps.cinvestav.mx/api";
// const host = "148.247.201.141:5000";
const host = "apix.tamps.cinvestav.mx/onca/api/v1";
// const host = "alpha.tamps"
// const protocol = "https";
//const protocol_onca = "https"
const protocol_onca = "https";
const base_url = `${protocol_onca}://${host}${port}`;
const observatory_id = route.params.observatory_id;
console.log("OBSERVATRY_ID", observatory_id);
const url = `${base_url}/observatories/${observatory_id}/products/nid`;
const urls = ref([]);
const groupedProducts = ref([]);

onMounted(async () => {
  const query_body = {
    interest: [],
    temporal: {
      low: 0,
      high: 2024,
      complete: true,
    },
    spatial: {
      country: "*",
      state: "02",
      municipality: "*",
    },
    tags: [observatory_id],
    // tags: ["retcpuebla"],
    // retcpuebla
  };

  const result = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query_body),
  });

  const data = await result.json();
  console.log("DATA", data);
  const grouped_products = data.reduce((acc, p) => {
    const type = p.product_type;
    console.log("TYPE", type);
    if (type == "csv") {
      return acc;
    }
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(p);
    console.log(acc[type]);
    return acc;
  }, {});

  groupedProducts.value = grouped_products;

  //   urls.value = data.slice(0, 100);
  //   console.log("DATA", data);
});
</script>

<style>
.container {
  width: 100vw;
  height: 100vh;
}
a[href] {
  color: blue; /* Sets the text color to a typical link color */
  text-decoration: underline; /* Underlines the text */
  cursor: pointer; /* Changes the cursor to pointer */
}

a[href]:hover {
  color: darkblue; /* Changes color on hover */
  text-decoration: underline; /* Keeps underline on hover */
}

a[href]:visited {
  color: purple; /* Changes the color for visited links */
}
.clickable {
  cursor: pointer;
}
/* .iframe-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  background: red;
  align-items: center;
}

.iframe-container iframe {
  transform: scale(1); /* Adjust the scale factor as needed */
/* width: 100%; Adjust width to compensate for scaling (1 / scale) */
/* height: 100%; Adjust height to compensate for scaling (1 / scale) */
</style>

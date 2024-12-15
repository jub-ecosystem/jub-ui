<template>
  <transition name="loading">
    <Loader v-if="loading" />
  </transition>
  <Navbar
    :text_color_normal="'black'"
    :text_color_scrolled="'black'"
    :background_color="'white'"
    :scrolled_background_color="'white'"
    :bars_color="'black'"
    :scrolled_bars_color="'black'"
    :scrolled_logo="'/images/muyal/muyal-black.png'"
    :normal_logo="'/images/muyal/muyal-black.png'"
    @loading="on_load"
  />
  <div
    ref="banner"
    class="front-page-v2 pa--xl flex justify-content--center align-items--center flex-direction--column"
  >
    <!-- <img @load="on_load"  :class="{'mb--lg':true}" :style="{'z-index':100}" src="/images/muyal/muyal-white.png" width="300" alt=""> -->
    <h1
      :style="{ 'z-index': 100 }"
      :class="{
        'w-60': !is_mobile,
        'front-page-v2--title': true,
        'text-align--center': !is_mobile,
        'text-align--justify': is_mobile,
        'mb--lg': true,
      }"
    >
      Plataforma de ciencia de datos para la visualización y buqeuda de
      productos de informacion del Registro Nacional de Cancer.
      <!-- Plataforma de ciencia de datos para la visualización y búsqueda de productos de información sobre salud pública. Secretaría de Salud del Gobierno del Estado de Veracruz. -->
      <!-- Plataforma tecnológica para la gestión, aseguramiento, intercambio y preservación de grandes volúmenes de datos en salud y construcción de un repositorio nacional de servicios de análisis de datos de salud. -->
      <!-- Plataforma de ciencia de datos para la visualización y búsqueda de productos del Observatorio de Cáncer y ambiente (OCA) -->
      <!-- Plataforma de ciencia de datos para la visualizacion y busqueda de productos del Observatorio de Cancer y ambiente (OCA) -->
    </h1>
    <div :class="{ 'front-page-v2__btns': true, flex: true, to_front: true }">
      <Button
        text="Observatorio en línea"
        color="black"
        hover_color="white"
        text_color="white"
        hover_text_color="black"
        @on_click="on_click"
      />
      <Button
        class="ml--sm"
        text="Ver más"
        color="black"
        hover_color="white"
        text_color="white"
        hover_text_color="black"
        @on_click="navigate('/')"
      />
    </div>
  </div>

  <Separator />
  <SimpleSection title="Principales colaboradores" subtitle="">
    <template v-slot:body>
      <div
        :class="{
          flex: true,
          'flex-direction--column': is_mobile,
          'justify-content--space-around': true,
          'align-items--center': true,
        }"
      >
        <div :class="{ logo_wrapper: true, 'mb--md': is_mobile }">
          <img src="/images/cinvestav.png" alt="" />
        </div>
        <div :class="{ logo_wrapper: true, 'mb--md': is_mobile }">
          <img src="/images/oca-rnc/imss.png" alt="Estado de Veracruz" />
        </div>
        <!-- <div :class="{'logo_wrapper':true,'mb--md':is_mobile }">
                    <img src="/images/inac.png" alt="">
                </div> -->
        <!-- <div class="logo_wrapper">
                    <img src="/images/uaslp.png" alt="">
                </div> -->
      </div>
    </template>
  </SimpleSection>
  <Separator />
  <SimpleSection ref="relevants" title="Productos más relevantes" subtitle="">
    <template v-if="!gallery_is_loading" v-slot:body>
      <div
        :class="{
          relevant_products__grid: !is_mobile,
          'relevant_products__grid--mobile': is_mobile,
        }"
      >
        <div
          class="product__wrapper"
          v-for="(product, index) in relevant_products"
          :key="product['key']"
          @mouseover="is_hovering[product['key']] = true"
          @mouseout="is_hovering[product['key']] = false"
        >
          <div :class="{ product__view: true, loading: is_loading[index] }">
            <iframe
              @load="is_loading[index] = false"
              v-show="!is_loading[index]"
              border="0"
              cellspacing="0"
              frameborder="0"
              class="relevant_product__frame"
              :src="product.url"
            ></iframe>
            <div
              class="flex flex-direction--column justify-content--center align-items--center"
            >
              <img
                class="product__loading"
                v-show="is_loading[index]"
                src="/images/continents.png"
                alt="LOADING..."
              />
              <span v-show="is_loading[index]">Cargando...</span>
            </div>
          </div>
          <div class="product__desc">
            <div
              class="flex align-items--center justify-content--space-between"
            >
              <div class="mr--xs">
                <h2 class="product__title">{{ product["title"] }}</h2>
                <span class="product__subtitle"
                  >Tipo de producto: {{ product["type"] }}</span
                >
              </div>
              <star-rating
                v-model:rating="product['rating']"
                :star-size="25"
                :read-only="true"
              />
            </div>
            <p class="product__text">
              {{ product["desc"] }}
            </p>
            <span class="product__datetime">{{ product["created_at"] }}</span>
            <div class="flex">
              <div
                class="flex mr--sm product__view-btn"
                @click="on_click_item(null, product['view'])"
              >
                <img
                  width="20"
                  class="mr--xs product__icon product__icon--view"
                  src="/icons/view/view_black.svg"
                  alt=""
                />
                <span>Ver</span>
              </div>
              <div
                class="product__download"
                @click="on_click_item(null, product['url'])"
              >
                <img
                  class="mr--xs product__icon product__icon--view"
                  width="20"
                  src="/icons/download/download_black.svg"
                  alt=""
                />
                <span>Descargar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="relevant_products.length > 0"
        class="mt--lg flex justify-content--center"
      >
        <Button @on_click="refresh_products" text="Actualizar" color="black" />
      </div>
      <div
        v-else
        class="flex justify-content--center flex-direction--column align-items--center"
      >
        <span class="mb--sm">No hay productos relevantes.</span>
        <Button @on_click="refresh_products" text="Actualizar" color="black" />
      </div>
      <!-- <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis impedit aperiam necessitatibus delectus, asperiores nihil cum cupiditate ipsa fugiat culpa deserunt ut corporis, sequi animi assumenda. Dolor atque corporis minima.</p> -->
    </template>
    <template v-slot:body v-else>
      <div
        class="product__gallery flex flex-direction--column justify-content--center align-items--center h-70"
      >
        <img width="30" src="/gifs/loading.gif" alt="" />
        <span>Cargando...</span>
        <!-- <p>LOADING...</p> -->
      </div>
    </template>
  </SimpleSection>
  <!-- <Separator/> -->

  <!-- <SimpleSection title="Modelo estandarizado para la gestion de registros de cáncer" subtitle="">
        <template v-slot:body>
            <p>La organización mundial de la salud propone un modelo estandarizado para <b>gestionar</b> los registros de cáncer, el cual debe incluir fases tales como <b>registro</b> de cáncer, <b>colección</b> y <b>almacenamiento</b> de datos, <b>disemnicación</b>, <b>análisis</b> e <b>investigación</b>.</p>
            <div class="flex justify-content--center">
                <img src="/images/model.png"/>
            </div>
        </template>
    </SimpleSection> -->
  <Separator />
  <Footer />
  <!-- <h1>OCA</h1> -->
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Button from "@/components/Button.vue";
import Loader from "@/components/Loader.vue";
import Separator from "@/components/Separator.vue";
import useBreakpoints from "vue-next-breakpoints";
import SimpleSection from "@/components/SimpleSection.vue";
import StarRating from "vue-star-rating";

// import {VueStars} from "vue-stars"
export default {
  setup() {
    const breakpoints = useBreakpoints({
      mobile: [240, 768], // max-width: 600px
      table: [768, 1024],
      desktop: [1281], // min-width: 601px
    });
    return {
      breakpoints,
    };
  },
  async mounted() {
    setTimeout(function () {
      localStorage.removeItem("relevant_products");
    }, 3 * 60 * 1000);
    this.get_relevant_products();
  },
  computed: {
    is_mobile() {
      return this.breakpoints.mobile.matches || this.breakpoints.table.matches;
    },
  },
  data() {
    return {
      loading: false,
      total_components: 2,
      relevant_products: [],
      is_hovering: {},
      is_loading: [],
      gallery_is_loading: true,
    };
  },
  methods: {
    async get_relevant_products() {
      this.gallery_is_loading = true;
      try {
        this.relevant_products = JSON.parse(
          localStorage.getItem("relevant_products_veracruz")
        );

        if (this.relevant_products) {
          // console.log("HIT OF RELEVANT_PRODUCTS")
          this.gallery_is_loading = false;
        } else {
          this.relevant_products = [];
          let response = await fetch(
            "https://alpha.tamps.cinvestav.mx/ocapi/",
            {
              method: "GET",
              // mode:"no-cors"
            }
          );
          let data = await response.json();
          let _relevant_products = data["data"];
          let relevant_products = _relevant_products.filter(
            (x) => x["extension"] != "zip"
          );
          let i = 0;
          console.log(relevant_products);
          for (let product of relevant_products) {
            this.is_loading.push(true);
            const product_id = product["product_id"];
            const stars = parseFloat(product["stars"]);
            console.log(`PRODUCT ${product}`);
            // const metadata    = (await fetch(`https://alpha.tamps.cinvestav.mx/mictlanx/metadata/${product_id}`,{method:"GET"}).then(response=>response.json()));
            // const metadata_url = `https://alpha.tamps.cinvestav.mx/mictlanx/metadata/${product_id}`
            // console.log(`METADATA_URL ${metadata_url}`)
            // const metadata_res    = await fetch(metadata_url,{method:"GET"}).then(res=>res.json())
            if (product["extension"] != "zip") {
              this.relevant_products.push({
                key: product_id,
                rating: Math.floor(stars),
                url: `https://alpha.tamps.cinvestav.mx/mictlanx/${product_id}`,
                view: `https://muyal.tamps.cinvestav.mx/OCA/veracruz/formulario/visualizador/${product_id}`,
                created_at: new Date(Date.now()).toLocaleDateString(),
                title: product["title"] || `Product ${i}`,
                desc:
                  product["description"] ||
                  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequatur odit praesentium minus, iusto possimus modi eius eligendi dolore, fuga nisi quae amet adipisci iste quam fugit, expedita molestiae sequi odio.",
                type: product["product_type"] || "Unknown",
              });
            }

            this.is_hovering[product["key"]] = false;
            i += 1;
          }
          this.relevant_products.sort((a, b) => {
            if (a.rating < b.rating) {
              return 1;
            } else if (a.rating > b.rating) {
              return -1;
            }
            return 0;
          });
          localStorage.setItem(
            "relevant_products_veracruz",
            JSON.stringify(this.relevant_products)
          );
          this.gallery_is_loading = false;
        }
        // console.log(`RESPONSE ${data}`)
      } catch (error) {
        console.log(`ERROR ${error}`);
        this.relevant_products = [];
      }
    },
    async refresh_products() {
      localStorage.removeItem("relevant_products_veracruz");
      // window.scrollTo({top:100, behavior:"smooth"})
      this.get_relevant_products();
      // await this.$nextTick(()=>{
      const x = this.$refs["relevants"];
      console.log("X", x);
      // const top = x.getBoundingClientRect().top;
      // window.scrollTo(0,top)
      if (x) {
        // x.scrollIntoView({behavior:"smooth"})
        x.$el.scrollIntoView({ behavior: "smooth" });
        // x.$el.scrollToTop({behavior:"smooth"})
      }

      // x.$el.scrollTop=0;
      //    })
      // window.relo
    },
    on_load() {
      // console.log("LOADED COMPONENT")
      this.loaded_components += 1;
      if (this.total_components == this.loaded_components) {
        this.loading = false;
      }
    },
    on_click() {
      window.location.assign("https://muyal.tamps.cinvestav.mx/OCA/veracruz/");
    },
    on_click_item(key, url) {
      // console.log("CLICK ON",product["key"])
      window.open(url, "_blank");
    },
  },
  components: {
    Navbar,
    Loader,
    SimpleSection,
    Separator,
    StarRating,
    Button,
    // VueStars
  },
};
</script>

<style scoped>
.product__gallery {
  height: 30vh !important;
  /* background: red; */
}
.logo_wrapper {
  --s: 300px;
  width: var(--s);
  height: var(--s);
  background: rgb(238, 238, 238);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: all ease 0.5s;
  padding: 10px;
}
.logo_wrapper:hover {
  transform: scale(1.1);
}
.logo_wrapper img {
  width: 200px;
}

.relevant_products__grid {
  display: grid;
  --s: 20px;
  column-gap: var(--s);
  row-gap: var(--s);
  grid-template-columns: repeat(2, 1fr);
}
.product__view.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(235, 240, 255);
}
.product__wrapper {
  /* background: red; */
  /* height: 30%; */
  padding: 20px;
  /* position: relative; */
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
.product__loading {
  width: 200px;
  /* filter: grayscale(0.1); */
  animation: loading_map 1s ease infinite;
}
.product__title {
  color: rgb(46, 46, 46);
  font-size: 18px;
}
.product__subtitle {
  font-size: 12px;
  color: rgb(161, 161, 161);
}
.product__text {
  font-size: 14px;
  text-align: justify;
  line-height: 1.5;
  color: rgb(73, 73, 73);
}
.product__download,
.product__view-btn {
  cursor: pointer;
}
@keyframes loading_map {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  60% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
.product__view {
  padding: 50px;
  /* background: red; */
}
.product__datetime {
  color: gray;
  font-size: 10px;
}
/* .relevant_product__item{
} */

.relevant_products__grid--mobile {
  display: grid;
  column-gap: 10px;
  row-gap: 10px;
  grid-template-columns: repeat(1, 1fr);
}

.relevant_product__item {
  position: relative;
  background: rgb(242, 242, 242);
  /* padding: 15px; */
  height: 500px;
  overflow: hidden;
}
.relevant_product__frame {
  position: relative;
  /* transform: scale(1.1); */
  /* position: absolute; */
  /* top: 0; */
  /* left: 0; */
  /* overflow-y: scroll; */
  /* zoom:.1; */
  width: 100%;
  height: 350px;
  /* border: 1px solid rgba(0,0,0,0.5); */
}
.relevant_product__overlay.hide {
  position: relative;
  left: -100%;
}

.relevant_product__overlay {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10;
}
.relevant_product__icon-wrapper {
  margin-top: 10px;
  width: 150px;
}
.relevant_product__icon {
  width: 50px;
  cursor: pointer;
  z-index: 10;
}
.relevant_product__stars {
  position: absolute;
}

.relevant_product__rating {
  position: absolute;
  font-size: 1.5rem;
  /* z-index: 00; */
}
/* .relevant_product__item::after {
    content: ""n;
    display: block;
    background-color: rgba(0, 0,0, 0.7);
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left:0;
} */
.front-page-v2 {
  height: 80vh;
  margin-top: 100px;
  /* background-color: rgba(0, 0,0, .1); */
  position: relative;
  /* background: url(/images/oca_0.png); */
  /* background: url(/images/oca_1.png); */
  /* background: url(/images/oca_2.jpg); */
  background: url(/images/oca-rnc/rnc.png);
  /* background-position: fit; */
  color: white;
}
.front-page-v2:after {
  content: "";
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  /* z-index: 100; */
}
.front-page-wrapper {
  /* background: red; */
  width: 100vw;
  height: 100vh;
}
.front-page {
  position: relative;
  width: 100%;
  min-width: 1500px;
  height: 100%;

  background: var(--color-black);
  color: var(--color-white);
  display: flex;
  justify-content: center;
  /* align-items: center; */
}

.front-page__container {
  display: flex;
  margin-top: 100px;
  flex-direction: column;
  align-items: center;
  width: 70%;
}
.front-page__logo {
  margin-bottom: 50px;
}
.front-page__logo img {
  width: 400px;
}

.front-page__text-container {
  margin-bottom: 50px;
}
.front-page__text {
  font-weight: bold;
  font-size: 1.5rem;
}

/* .front-page__project-number{
  background: var(--color-white);
  color: var(--color-black);
  padding: 15px;
  border-radius: 5px;
  font-size: 1.5rem;
} */
</style>

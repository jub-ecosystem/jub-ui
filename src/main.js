import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Button from "./components/Button.vue";
import Loader from './components/Loader.vue'
import { VueStars } from "vue-stars"
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader


import App from './App.vue';
import router from './router';
import './assets/main.css';

const light_theme = {
  dark: false,
  colors: {
    background: '#fff',
    surface: '#FFFFFF',
    primary: '#1E88E5',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}
const app = createApp(App);

const vuetify = createVuetify({
  components:{
    //  VDataTable,
    // VDataTableServer,
    // VDataTableVirtual,
    ...components
  },
  directives,
  // defaultTheme: "light_theme"
  theme:{
    defaultTheme: 'light_theme',
    themes: {
      light_theme
    }
  },
  icons:{
    defaultSet: "mdi",
    aliases,
    sets:{
      mdi,
    }
  },
  display:{
    mobileBreakpoint:"sm",
    thresholds:{
      xs: 0,
      sm: 340,
      md: 540,
      lg: 800, 
      xl: 1280
    }
  }
});

const MyPlugin = {
  install(app, options) {
    app.config.globalProperties.$resolve_image = (x) => {
        const url  = new URL(x,import.meta.url).href
        return url
    }

    app.config.globalProperties.$resolve_img = (x) => {
        return x
    }
  },
}
app.use(vuetify)
app.use(MyPlugin)

app.use(createPinia());
app.use(router);
// app.use(VueCarousel)
// app.use(VueGlide)
//  Component registration
app.component("vue-stars", VueStars)
// app.component("Section",Section);
// app.component("PlatformsNav",PlatformsNav);
// app.component("FeatureBox",FeatureBox);
// app.component("Footer",Footer);
// app.component("Card",Card);
// app.component("PortionSection",PortionSection);
// app.component("IconCard",IconCard);
app.component("Button",Button);
// app.component("ImageBanenr",ImageBanner);
// app.component("ContactCard",ContactCard);
// app.component("Separator",Separator);
// app.component("SimpleSection",SimpleSection);
// app.component("ListTable",ListTable)
app.component("Loader",Loader)
// app.component("VNumberInput",VNumberInput)
app.mount('#app')

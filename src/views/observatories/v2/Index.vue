<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar title="Application bar"></v-app-bar>

    <v-main>
      <v-container>
        <v-text-field
          clearable
          v-model="x.sv"
          label="Spatial Variable"
          prepend-icon="mdi-earth"
        ></v-text-field>
        <v-text-field
          clearable
          v-model="x.tv"
          label="Temporal Variable"
          prepend-icon="mdi-clock"
        ></v-text-field>
        <v-text-field
          v-model="x.iv"
          clearable
          label="Interest Variable"
          prepend-icon="mdi-shape"
        ></v-text-field>
        <v-text-field
          clearable
          v-model="x.pt"
          label="Product Type"
          prepend-icon="mdi-chart-scatter-plot"
        ></v-text-field>
      </v-container>
      <v-container class="d-flex justify-center">
        <v-btn
          :loading="loading"
          @click="on_click"
          block
          prepend-icon="mdi-magnify"
        >
          Run query
        </v-btn>
        <v-overlay contained v-model="overlay">
          <v-toolbar :elevation="5" title="Found X products">
            <v-btn @click="overlay = false" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container
            fluid
            class="container d-flex flex-column bg-surface-variant"
          >
            <v-row v-for="m in 5" no-gutters>
              <v-col v-for="n in 10" :key="n">
                <v-sheet class="ma-2 pa-2"> {{ n }}</v-sheet>
              </v-col>
            </v-row>
          </v-container>
        </v-overlay>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, reactive } from "vue";
const overlay = ref(false);
const loading = ref(false);
const x = reactive({ sv: "*", tv: "*", iv: "*", pt: "*" });

const on_click = () => {
  try {
    loading.value = true;
    overlay.value = true;
    const URL = "http://localhost:5000/";
  } catch (error) {
  } finally {
    // overlay.value = false;
  }
};
</script>

<style>
.container {
  width: 100vw;
  height: 100vh;
}
</style>

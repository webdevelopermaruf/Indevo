<script setup>
import { RouterView } from "vue-router";
import {useThemeStore} from "@/stores/theme.store.js";
import Installable from "@/installation/Installable.vue";
const themeStore = useThemeStore()

</script>

<template>
  <Installable/>
  <RouterView/>
</template>

<style>
*{margin: 0; padding: 0; box-sizing: border-box;}
</style>
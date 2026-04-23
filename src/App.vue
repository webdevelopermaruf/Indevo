<script setup>
import { RouterView } from "vue-router";
import {useThemeStore} from "@/stores/theme.store.js";
const themeStore = useThemeStore()

</script>

<template>
  <RouterView/>
</template>

<style>
*{margin: 0; padding: 0; box-sizing: border-box;}
</style>
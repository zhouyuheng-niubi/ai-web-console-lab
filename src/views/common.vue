<template>
  <div>{{ route.query.name}}</div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
const route = useRoute();

</script>
<style scoped>

</style>

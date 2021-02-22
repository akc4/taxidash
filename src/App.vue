<template>
  <div class="flex flex-col bg-gray-300 w-full">
    
    <Trips class="pt-5" />
  </div>
</template>

<script>
import Trips from "./components/Trips.vue";

export default {
  name: "App",
  components: {
    Trips,
  },
};
</script>


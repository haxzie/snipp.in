<template>
  <router-view></router-view>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  methods: {
    ...mapActions("Files", ["loadFiles"]),
  },
  async mounted() {
    this.loadFiles();
  },
};
</script>

<style lang="scss" scoped></style>

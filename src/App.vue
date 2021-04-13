<template>
  <div :class="['root', getActiveTheme]">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapGetters("UI", ["getActiveTheme"])
  },
  methods: {
    ...mapActions("Files", ["loadFiles"]),
  },
  async mounted() {
    this.loadFiles();
  },
};
</script>

<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

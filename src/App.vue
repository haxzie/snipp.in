<template>
  <div :class="['root', getActiveTheme]">
    <router-view></router-view>
    <notifications position="bottom right" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import update from "@/mixins/update";

export default {
  name: "App",
  mixins: [update],
  computed: {
    ...mapGetters("UI", ["getActiveTheme"]),
  },
  methods: {
    ...mapActions("Files", ["loadFiles"]),
  },
  async mounted() {
    this.loadFiles();
  },
  watch: {
    updateExists: {
      immediate: true,
      handler(value) {
        if (value) {
          this.$notify({
            title: "Update Available!",
            text: "A new version of snipp.in is available, please refresh the page to apply new changes",
          });
        }
      },
    },
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

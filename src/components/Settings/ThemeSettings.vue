<template>
  <div class="theme-settings">
    <h4 class="title">Choose a theme</h4>
    <div class="themes-grid">
      <div
        :class="['theme-selection', { active: getActiveTheme === 'dark' }]"
        @click="setActiveTheme({ theme: 'dark' })"
      >
        <img src="@/assets/snippin-dark.svg" alt="" />
        <h4>Dark Theme</h4>
      </div>
      <div
        :class="['theme-selection', { active: getActiveTheme === 'light' }]"
        @click="setActiveTheme({ theme: 'light' })"
      >
        <img src="@/assets/snippin-light.svg" alt="" />
        <h4>Light Theme</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("UI", ["getActiveTheme"]),
  },
  methods: {
    ...mapActions("UI", ["setActiveTheme"]),
  },
};
</script>

<style lang="scss" scoped>
.theme-settings {
  display: flex;
  flex-direction: column;
  padding: 15px;

  .section-title {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .themes-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 15px;

    .theme-selection {
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 2px solid transparent;
      border-radius: 5px;
      padding: 5px;

      h4 {
        padding: 10px;
      }

      img {
        width: 100%;
        height: auto;
        border-radius: 5px;
      }

      &:hover {
        cursor: pointer;
        background: var(--color-secondary-light);
      }

      &.active {
        background: var(--color-primary);
        h4 {
          color: var(--color-secondary);
        }
      }
    }
  }
}
</style>

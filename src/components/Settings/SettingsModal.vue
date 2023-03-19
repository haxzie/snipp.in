<template>
  <div class="popup-background" @click.self="$router.push('/')">
    <div class="settings-card">
      <div class="header">
        <div class="title-bar">
          <h4>Settings</h4>
          <div class="close-btn" @click="$router.push('/')">
            <XIcon size="20" />
          </div>
        </div>
        <div class="navigation-tabs">
          <div
            v-for="tab in Object.values(settingsPanels)"
            :key="tab.id"
            :class="['tab', { active: tab.id === activeTab }]"
            @click="activeTab = tab.id"
          >
            <span>{{ tab.name }}</span>
          </div>
        </div>
      </div>
      <div class="contents">
        <component :is="settingsPanels[activeTab].component" />
      </div>
    </div>
  </div>
</template>

<script>
import { XIcon } from "vue-feather-icons";
import GeneralSettings from "./GeneralSettings";
import ThemeSettings from "./ThemeSettings";
import IntegrationSettings from "./IntegrationSettings";
import FeaturePreviews from "./FeaturePreview";

export default {
  components: {
    XIcon,
    GeneralSettings,
    ThemeSettings,
    IntegrationSettings,
    FeaturePreviews,
  },
  data() {
    return {
      activeTab: "general",
      settingsPanels: {
        general: {
          id: "general",
          name: "General",
          component: "GeneralSettings",
        },
        themes: {
          id: "themes",
          name: "Themes",
          component: "ThemeSettings",
        },
        // integrations: {
        //   id: "integrations",
        //   name: "Integrations",
        //   component: "IntegrationSettings",
        // },
        // feature_preview: {
        //   id: "feature_preview",
        //   name: "Feature Preview",
        //   component: "FeaturePreviews",
        // },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.popup-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--popup-background);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;

  .settings-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: var(--color-secondary);
    max-width: 700px;
    max-height: 500px;
    border-radius: 5px;

    .header {
      display: flex;
      flex-direction: column;

      .title-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--border-color);
        padding: 10px 15px;

        h4 {
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.1rem;
        }

        .close-btn {
          padding: 5px;
          background: var(--color-secondary-light);
          display: flex;
          align-content: center;
          justify-content: center;
          border-radius: 5px;

          &:hover {
            cursor: pointer;
            color: var(--color-error);
          }
        }
      }

      .navigation-tabs {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
        padding: 0 5px;

        .tab {
          padding: 10px 15px;
          opacity: 0.7;
          border-bottom: 2px solid transparent;
          transition: 0.3s border ease-in-out;

          &.active {
            opacity: 1;
            border-bottom: 2px solid var(--color-primary);
          }

          &:hover {
            cursor: pointer;
            opacity: 1;
          }
        }
      }
    }

    .contents {
      height: 100%;
      flex: 1;
      overflow: auto;
    }
  }
}
</style>

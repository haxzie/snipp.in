<template>
  <div class="side-navigation-bar">
    <div class="branding">
      <Logo size="25" />
    </div>
    <div class="menu expand">
      <div
        v-for="menuItem in getPanels"
        :key="menuItem.id"
        :class="['menu-icon', { active: getActivePanelId === menuItem.id }]"
        @click="
          setActivePanelId({
            id: getActivePanelId === menuItem.id ? null : menuItem.id,
          })
        "
      >
        <component :is="menuItem.icon" size="20" />
        <span class="menu-tooltip">{{ menuItem.name }}</span>
      </div>
    </div>
    <div class="menu">
      <a
        v-for="menuItem in bottomMenu"
        :key="menuItem.id"
        class="menu-icon"
        :href="menuItem.link"
        rel="noreferrer noopener"
        target="_blank"
        @click="menuItem.click ? menuItem.click() : null"
      >
        <component :is="menuItem.icon" size="20" />
        <span class="menu-tooltip">{{ menuItem.name }}</span>
      </a>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/shared/Logo";
import {
  FileTextIcon,
  SearchIcon,
  TrashIcon,
  SettingsIcon,
  GithubIcon,
  CommandIcon,
} from "vue-feather-icons";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    Logo,
    FileTextIcon,
    SearchIcon,
    TrashIcon,
    SettingsIcon,
    GithubIcon,
    CommandIcon,
  },
  data() {
    return {
      bottomMenu: [
        {
          id: "commandCenter",
          icon: "CommandIcon",
          name: "Commands/Shortcuts [Alt+K]",
          click: this.toggleCommandCenter,
        },
        {
          id: "settings",
          icon: "SettingsIcon",
          name: "Settings",
          click: () => {
            this.$router.push("/settings");
          },
        },
        {
          id: "github",
          icon: "GithubIcon",
          name: "GitHub",
          link: "https://github.com/haxzie/snipp.in",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("UI", [
      "getActivePanelId",
      "getPanels",
      "getShowCommandCenter",
    ]),
  },
  methods: {
    ...mapActions("UI", ["setActivePanelId", "setShowCommandCenter"]),
    toggleCommandCenter() {
      this.setShowCommandCenter(!this.getShowCommandCenter);
    },
  },
};
</script>

<style lang="scss" scoped>
.side-navigation-bar {
  background: var(--color-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid var(--border-color);

  .branding {
    padding: 10px;
    border-bottom: 1px solid var(--border-color);
  }

  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;

    &.expand {
      flex: 1;
    }

    .menu-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      opacity: 0.5;
      margin-bottom: 5px;
      position: relative;
      transition: 0.3s all ease-in-out;
      color: var(--font-color);

      .menu-tooltip {
        position: absolute;
        left: 50px;
        top: 0;
        z-index: 99;
        white-space: nowrap;
        background: var(--color-secondary);
        padding: 10px 15px;
        border-radius: 5px;
        opacity: 0;
        transform: translateX(-30px);
        transition: 0.3s all ease-in-out;
        pointer-events: none;
      }

      &:hover {
        background: var(--color-secondary-light);
        opacity: 1;
        cursor: pointer;
        border-radius: 5px;

        .menu-tooltip {
          display: flex;
          transform: translateX(0px);
          opacity: 1;
        }
      }

      &.active {
        background: var(--color-secondary-light);
        color: var(--color-primary);
        opacity: 1;
        border-radius: 5px;

        // .menu-tooltip {
        //   display: none;
        // }
      }
    }
  }
}
</style>

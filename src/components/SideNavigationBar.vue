<template>
  <div class="side-navigation-bar">
    <div class="branding">
      <Logo size="25" />
    </div>
    <div class="menu expand">
      <div
        v-for="menuItem in menuOptions"
        :key="menuItem.id"
        :class="['menu-icon', { active: activeOption === menuItem.id }]"
        @click="
          () =>
            $emit('change', activeOption === menuItem.id ? null : menuItem.id)
        "
      >
        <component :is="menuItem.icon" size="20" />
        <span class="menu-tooltip">{{ menuItem.name }}</span>
      </div>
    </div>
    <div class="menu">
      <div v-for="menuItem in bottomMenu" :key="menuItem.id" class="menu-icon">
        <component :is="menuItem.icon" size="20" />
        <span class="menu-tooltip">{{ menuItem.name }}</span>
      </div>
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
} from "vue-feather-icons";

export default {
  components: {
    Logo,
    FileTextIcon,
    SearchIcon,
    TrashIcon,
    SettingsIcon,
    GithubIcon,
  },
  props: {
    menuOptions: Array,
    activeOption: String,
  },
  data() {
    return {
      activeMenuItem: "explorer",
      bottomMenu: [
        {
          id: "settings",
          icon: "SettingsIcon",
          name: "Settings",
        },
        {
          id: "github",
          icon: "GithubIcon",
          name: "GitHub",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.side-navigation-bar {
  background: var(--color-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;

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
        color: var(--color-accent);
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

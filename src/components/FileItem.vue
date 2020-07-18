<template>
  <div :class="['file-item', { active: isActive}]" @click="openFile(file.file_id)">
    <FileTextIcon class="icon" size="18" /><span>{{ file.name }}</span>
  </div>
</template>

<script>
import { FileTextIcon } from "vue-feather-icons";
import { mapActions } from "vuex";

export default {
  components: {
    FileTextIcon,
  },
  props: {
    file: Object,
    isActive: Boolean
  },
  methods: {
    ...mapActions("Editor", ["openFile"]),
  },
};
</script>

<style lang="scss" scoped>
.file-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 10px;
  margin: 0 5px;
  border-radius: 5px;

  &.active {
    // color: var(--color-primary);
    background: var(--color-secondary);
  }

  .icon {
    margin-right: 10px;
  }

  &:hover {
    background: var(--color-secondary);
    cursor: pointer;
  }
}
</style>

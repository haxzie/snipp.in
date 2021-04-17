<template>
  <div class="loading-screen">
    <logo-skeleton />
    <ProgressView />
  </div>
</template>

<script>
import LogoSkeleton from "@/components/shared/LogoSkeleton";
import ProgressView from "@/components/shared/ProgressView";
export default {
  components: {
    LogoSkeleton,
    ProgressView,
  },
};
</script>

<style lang="scss" scoped>
.loading-screen {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
}
</style>

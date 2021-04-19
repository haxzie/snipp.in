<template>
  <div class="loading-screen">
    <div class="content-wrapper">
      <logo-skeleton size="150" class="logo"/>
      <p>Loading Editor...</p>
    </div>
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

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .logo {
      opacity: 0.7;
    }

    p {
      margin: 20px 0 0 0;
      font-size: 1.2rem;
      opacity: 0.7;
    }
  }
}
</style>

<template>
  <div class="mobileViewModalBackground">
    <div class="modal">
      <h2>Snipp.in is optimized for desktops :(</h2>
      <p>
        Please switch to your desktop/laptop browser to use snipp.in. The app is
        optimized for desktops. Mobile devices might exhibit unexpected
        behaviours
      </p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "../styles/setup/mixins";
.mobileViewModalBackground {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--popup-background);
    backdrop-filter: blur(10px);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99999;
    display: none;

    @include respond-below(sm) {
        display: flex;
    }

    .modal {
        width: 90%;
        max-width: 600px;

        h2 {
            font-size: 1.2rem;
            font-weight: bold;
            color: var(--font-color);
            margin: 15px 0;
            line-height: 1.6rem;
        }
    }
}
</style>

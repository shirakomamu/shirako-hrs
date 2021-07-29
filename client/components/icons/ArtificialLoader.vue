<template>
  <svg
    xml:space="preserve"
    viewBox="0 0 100 100"
    y="0"
    x="0"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    fill="currentColor"
  >
    <g
      style="transform-origin: 50% 50% 0px; transform: rotate(0deg) scale(0.8)"
      class="ldl-scale"
    >
      <g class="ldl-ani" style="transform-origin: 50px 50px 0px">
        <g class="ldl-layer">
          <g class="ldl-ani ldl-ani-1">
            <path
              d="M88.7 71.8c-3.6 5.6-8.4 10.3-14 13.7-5.6 3.4-11.9 5.4-18.2 5.9l-2.4.1h-2.4c-1.6 0-3.2-.2-4.7-.4-3.1-.4-6.2-1.3-9.1-2.4-5.8-2.3-11-5.9-15.1-10.4 4.5 4.1 9.9 7.1 15.7 8.7 2.9.8 5.8 1.3 8.8 1.4 1.5.1 2.9.1 4.4-.1.7-.1 1.5-.1 2.2-.2l2.2-.3c5.7-1.1 11.2-3.4 15.7-6.8 4.6-3.4 8.3-7.9 10.8-12.8.9-1.7 3-2.4 4.8-1.5 1.7.9 2.4 3 1.5 4.8-.1 0-.1.1-.2.3z"
            ></path>
          </g>
        </g>
        <g class="ldl-layer">
          <g class="ldl-ani ldl-ani-2">
            <path
              d="M50.7 6.5c-2 .1-3.5 1.8-3.4 3.7.1 2 1.8 3.5 3.7 3.4 5.6-.3 11.2.7 16.5 3 1.3.5 2.6 1.2 3.8 1.9.6.3 1.2.7 1.8 1.1l1.8 1.2 1.7 1.4c.5.5 1.2.9 1.6 1.4 1 1 2.1 2 3 3.2 3.8 4.4 6.6 9.8 8.1 15.6l.4 2.2c.1.7.3 1.5.4 2.2.1 1.5.4 3 .4 4.5 0 3-.3 6.1-.9 9 .9-2.9 1.5-5.9 1.8-9 .2-1.5.1-3.1.1-4.6 0-.8-.1-1.5-.2-2.3l-.2-2.4c-.9-6.2-3.4-12.2-7-17.4-.8-1.4-1.9-2.5-2.9-3.8-.5-.6-1.1-1.2-1.7-1.7l-1.7-1.7-1.9-1.5c-.6-.5-1.2-1-1.9-1.5-1.3-.9-2.7-1.9-4.1-2.6-5.7-3.1-12.2-5-18.8-5.3h-.4z"
            ></path>
          </g>
        </g>
        <g class="ldl-layer">
          <g class="ldl-ani ldl-ani-3">
            <path
              d="M32 14.4c-2.8 1.4-5.5 2.9-7.9 4.9l-.9.7-.9.8c-.6.5-1.2 1-1.7 1.6-1.1 1.2-2.2 2.3-3.1 3.5-1 1.2-1.9 2.5-2.7 3.9l-1.2 2.1L13 33c-.2.4-.3.7-.5 1.1l-1 2.2-.8 2.3c-.3.8-.5 1.5-.7 2.3-.2.8-.4 1.6-.6 2.3-.3 1.6-.6 3.2-.7 4.8-.2 1.6-.3 3.2-.2 4.9.1 6.5 1.8 13.1 4.9 19 .1.1.1.2.2.3 1.1 1.6 3.3 2.1 4.9 1 1.6-1.1 2.1-3.3 1-4.9-3-4.7-5-10.1-5.7-15.7-.2-1.4-.2-2.8-.2-4.3-.1-1.4.1-2.9.2-4.3l.3-2.1c.1-.7.2-1.4.4-2.1l.5-2.1.7-2.1c.1-.3.2-.7.4-1l.4-1c.3-.7.6-1.4.9-2 .7-1.3 1.3-2.6 2.2-3.8.8-1.3 1.7-2.4 2.6-3.6.5-.6 1-1.1 1.5-1.7l.7-.8.8-.8c2.1-2.1 4.6-3.9 7.1-5.5 2.6-1.6 5.4-2.8 8.3-3.8-2.9.5-5.8 1.4-8.6 2.8z"
            ></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "ArtificialLoader",
  setup() {},
});
</script>

<style lang="less" scoped>
.ldl-ani {
  transform-origin: 50px 50px 0px;
  transform: rotate(0deg);
  animation: 1.11111s linear -0.925926s infinite alternate forwards running spinspin;
}

.ldl-ani-1 {
  opacity: 1;
}
.ldl-ani-2 {
  opacity: 0.5;
}
.ldl-ani-3 {
  opacity: 0.8;
}

@keyframes spinspin {
  0% {
    animation-timing-function: cubic-bezier(0.5856, 0.0703, 0.4143, 0.9297);
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(720deg);
  }
}
</style>

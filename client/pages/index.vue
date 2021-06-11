<template>
  <div class="home space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-2 grid-flow-row">
      <article class="intro space-y-4 max-w-prose">
        <h4 class="text-4xl dark:text-white">Hello. 👋</h4>
        <p
          v-for="(text, index) of introTexts"
          :key="index"
          class="dark:text-gray-200"
        >
          {{ text }}
        </p>
      </article>
      <div class="grid col-span-2 md:col-span-1 place-items-center">
        <blockquote class="quote mt-8">
          <p
            class="italic text-center text-gray-600 dark:text-gray-400 text-2xl"
          >
            {{ quote.text }}
          </p>
          <footer class="text-right">
            <a
              :href="quote.source"
              class="
                hover:underline
                focus:underline
                italic
                font-semibold
                text-blue-500
              "
              target="_blank"
              rel="noopener noreferrer"
            >
              ― {{ quote.author }}
            </a>
          </footer>
        </blockquote>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      introTexts: [
        `Welcome to my personal site.`,
        `I am a web developer with an engineering background.
      My education is in Aerospace Engineering (structural composites and optimization),
      but I self-taught modern web technologies both as a hobby and professionally.`,
        `I am based out of California, USA, and I specialize in building intelligent web apps for business workflows.`,
      ] as string[],
      quote: {
        text: `Everybody has a testing environment.
      Some people are lucky enough to have a totally separate environment to run production in.`,
        source: "https://twitter.com/stahnma/status/634849376343429120",
        author: "@stahnma",
      },
    };
  },
});
</script>

<style lang="less" scoped>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

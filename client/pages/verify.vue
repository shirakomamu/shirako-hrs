<template>
  <div class="sign-in space-y-8 flex justify-center items-center">
    <div class="max-w-prose w-full bg-gray-200 dark:bg-gray-700 p-8">
      <form name="login" class="grid gap-4 w-full" @submit.prevent="onSubmit">
        <h5 class="text-2xl dark:text-white">Verify your account</h5>
        <div class="grid gap-1 text-sm">
          <p>
            An email was just sent to t**@e****.***. Don't see it?
            <span>Resend email message.</span>
          </p>
        </div>

        <div class="grid gap-1">
          <label :for="otpCodeUid" class="text-sm">OTP code</label>
          <input
            :id="otpCodeUid"
            type="email"
            name="email"
            class="p-2 text-sm w-full"
            required
          />
        </div>

        <div class="grid gap-4 mt-4">
          <button
            type="submit"
            class="bg-black dark:bg-white text-white dark:text-black"
          >
            Send recovery email
          </button>
          <div class="grid gap-2">
            <nuxt-link
              to="/login"
              class="
                text-sm text-gray-400
                hover:text-black
                focus:text-black
                dark:hover:text-white dark:focus:text-white
                transition-colors
              "
              >Sign in to existing account</nuxt-link
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import { validate } from "uuid";
import uniqueId from "@@/common/utils/uniqueId";
import { OtpTokenCheckDto } from "@@/common/dto/auth";
import { NUM_TOKEN_DIGITS } from "src/config/memberVerification";

export default Vue.extend({
  async asyncData({ route, store, redirect }) {
    const query = route.query;

    if (
      !query.otpToken ||
      typeof query.otpToken !== "string" ||
      !validate(query.otpToken)
    ) {
      return redirect("/");
    }

    if (
      query.otpCode &&
      typeof query.otpCode !== "string" &&
      query.otpCode.length !== NUM_TOKEN_DIGITS
    ) {
      return redirect("/");
    }

    try {
      const response = await store.dispatch("api/send", {
        method: "post",
        url: "/api/auth/register/token",
        data: {
          otpToken: query.otpToken,
          otpCode: query.otpCode,
        } as OtpTokenCheckDto,
      });

      console.log(JSON.stringify(response, undefined, 2));
    } catch (e) {
      console.log("ERROR");
      console.log(e);
    }

    return {};
  },
  data() {
    return {
      uid: uniqueId() as string,
    };
  },
  head() {
    return {
      title: "Verify account | " + this.$config.appinfo.name,
    };
  },
  computed: {
    otpCodeUid(): string {
      return "username-" + this.uid;
    },
  },
  methods: {
    async onSubmit() {
      // await this.api({
      //   method: "post",
      //   url: "/api/auth/recover",
      // });
    },
    ...mapActions({ api: "api/send" }),
  },
});
</script>

<style lang="less" scoped></style>

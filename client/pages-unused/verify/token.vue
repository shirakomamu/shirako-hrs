<template>
  <div class="sign-in space-y-8 flex justify-center items-center">
    <div class="max-w-prose w-full bg-gray-200 dark:bg-gray-700 p-8 grid gap-4">
      <form
        v-if="tokenResult.ok"
        name="verify"
        class="grid grid-cols-1 gap-4"
        @submit.prevent="onSubmit"
      >
        <template
          v-if="tokenResult.ok && tokenResult.payload.status === 'verifying'"
        >
          <div
            v-if="tokenResult.payload.otpCodeError"
            class="bg-red-500 bg-opacity-10 p-4"
          >
            <p class="text-red-500">Invalid OTP code.</p>
          </div>
          <h5 class="text-2xl dark:text-white">Verify your account</h5>
          <div class="grid grid-cols-1 gap-1 text-sm">
            <p>
              An email was sent to {{ tokenResult.payload.emailHint }}. Don't
              see it? <span>Resend email message.</span>
            </p>
          </div>

          <div class="grid grid-cols-1 gap-1">
            <label :for="otpCodeUid" class="text-sm">OTP code</label>
            <Input
              :id="otpCodeUid"
              v-model="otpCode"
              type="text"
              name="otpCode"
              pattern="^[0-9]{6}$"
              placeholder="000000"
              classes="p-2 text-sm w-full"
              passive-text="Check your email inbox for a 6-digit code."
              required
            />
          </div>

          <div class="grid grid-cols-1 gap-4 mt-4">
            <button
              type="submit"
              class="bg-black dark:bg-white text-white dark:text-black"
            >
              Send recovery email
            </button>
          </div>
        </template>
        <template v-else-if="tokenResult.payload.status === 'verified'">
          <h5 class="text-2xl dark:text-white">Account verified</h5>
          <div class="grid grid-cols-1 gap-1 text-sm">
            <p>Congratulations! Your account has been verified.</p>
            <nuxt-link to="/login">Please sign in.</nuxt-link>
          </div>
        </template>
      </form>
      <div v-else class="grid grid-cols-1 gap-4">
        <h5 class="text-2xl dark:text-white">Cannot verify account</h5>
        <div class="grid grid-cols-1 gap-1 text-sm">
          <p>{{ tokenResult.error.message || tokenResult.error.name }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-2">
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import { validate } from "uuid";
import uniqueId from "@@/common/utils/uniqueId";
import { OtpTokenCheckDto } from "@@/common/dto/auth";
import { NUM_TOKEN_DIGITS } from "src/config/memberVerification";
import ISrkResponse, { IOtpTokenCheckPayload } from "@@/common/interfaces/api";
// import { VerificationStatus } from "src/entities/Member";

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

    const tokenResult: ISrkResponse<IOtpTokenCheckPayload> =
      await store.dispatch("api/send", {
        method: "post",
        url: "/api/auth/register/token",
        data: {
          otpToken: query.otpToken,
          otpCode: query.otpCode,
        } as OtpTokenCheckDto,
      });

    if (tokenResult.ok && tokenResult.payload.status === "verified") {
      return redirect({
        path: "/verify/success",
        params: {
          otpToken: query.otpToken,
        },
      });
    }

    // const tokenResult = {
    //   ok: true,
    //   payload: {
    //     otpCodeError: true,
    //     status: "verifying" as VerificationStatus,
    //     emailHint: "m*****@e******.***",
    //   },
    // };

    return { tokenResult };
  },
  data() {
    const data = {
      uid: uniqueId() as string,
      otpCode: null as string | null,
      otpCodeError: false as boolean,
    };

    return data as typeof data & {
      tokenResult: ISrkResponse<IOtpTokenCheckPayload>;
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
  created() {
    if (this.tokenResult.ok && this.tokenResult.payload.otpCodeError) {
      this.$router.replace({
        path: "/verify/token",
        query: {
          otpToken: this.$route.query.otpToken,
        },
      });
    }
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

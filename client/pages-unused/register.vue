<template>
  <div class="register space-y-8 flex justify-center items-center">
    <div class="max-w-prose w-full bg-gray-200 dark:bg-gray-700 p-8">
      <form
        name="register"
        class="grid gap-4 w-full"
        @submit.prevent="onSubmit"
      >
        <h5 class="text-2xl dark:text-white">
          Create your {{ $config.appinfo.name }} account
        </h5>
        <div class="grid gap-1">
          <label :for="userUid" class="text-sm">Username</label>
          <Input
            :id="userUid"
            v-model="username"
            :validator="usernameValidator"
            type="text"
            name="username"
            classes="p-2 text-sm w-full"
            passive-text="Username is used to log into your account."
            required
            :disabled="isDisabled || isLoading"
          />
        </div>

        <div class="grid gap-1">
          <label :for="displayNameUid" class="text-sm">Display name</label>
          <Input
            :id="displayNameUid"
            v-model="displayName"
            :validator="displayNameValidator"
            type="text"
            name="displayName"
            classes="p-2 text-sm w-full"
            passive-text="Display name is how you will be identified to other users."
            required
            :disabled="isDisabled || isLoading"
          />
        </div>

        <div class="grid gap-1">
          <label :for="emailUid" class="text-sm">Email address</label>
          <Input
            :id="emailUid"
            v-model="email"
            type="email"
            name="email"
            classes="p-2 text-sm w-full"
            passive-text="Email address is only used to verify and recover your account."
            required
            :disabled="isDisabled || isLoading"
          />
        </div>

        <div class="grid gap-1">
          <label :for="passwordUid" class="text-sm">Password</label>
          <PasswordInput
            :id="passwordUid"
            v-model="password"
            :dict="pwDict"
            name="password"
            classes="p-2 text-sm w-full"
            required
            :disabled="isDisabled || isLoading"
          />
        </div>

        <div class="grid gap-4 mt-4">
          <ComboButton
            type="submit"
            class="bg-black dark:bg-white text-white dark:text-black"
            :disabled="isDisabled"
            :loading="isLoading"
          >
            Create account
          </ComboButton>
          <!-- <div class="grid gap-2">
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
          </div> -->
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import uniqueId from "@@/common/utils/uniqueId";
import createZxcvbnDictForRegistration from "@@/common/utils/createZxcvbnDictForRegistration";
import ISrkResponse, {
  IMemberRegisterPayload,
  INameCheckPayload,
} from "@@/common/interfaces/api";
import { MemberRegistrationDto, NameCheckDto } from "@@/common/dto/auth";

export default Vue.extend({
  data() {
    return {
      uid: uniqueId() as string,
      username: null as string | null,
      displayName: null as string | null,
      email: null as string | null,
      password: null as string | null,
      dnTimer: null as any, // timeout object
      isDisabled: false as boolean,
      isLoading: false as boolean,
    };
  },
  head() {
    return {
      title: "Create an account | " + this.$config.appinfo.name,
    };
  },
  computed: {
    userUid(): string {
      return "username-" + this.uid;
    },
    displayNameUid(): string {
      return "display-name-" + this.uid;
    },
    emailUid(): string {
      return "email-" + this.uid;
    },
    passwordUid(): string {
      return "password-" + this.uid;
    },
    pwDict(): string[] {
      return createZxcvbnDictForRegistration({
        username: this.username,
        displayName: this.displayName,
        email: this.email,
      });
    },
  },
  methods: {
    async usernameValidator(value: string) {
      if (value.length < 1 || value.length > 24) {
        return "Username must be 1 to 24 characters long.";
      }
      if (!/^[A-z0-9]+$/.test(value)) {
        return "Username must consist of letters and numbers only.";
      }

      const response: ISrkResponse<INameCheckPayload> = await this.api({
        method: "post",
        url: "/api/auth/ncheck",
        data: {
          type: "un",
          name: this.username,
        } as NameCheckDto,
      });

      if (!response.ok) {
        return response.error.message || response.error.name;
      }

      if (!response.payload.isAvailable) {
        return "Username is not available.";
      }

      return "";
    },
    async displayNameValidator(value: string) {
      if (value.length < 1 || value.length > 24) {
        return "Display name must be 1 to 24 characters long.";
      }

      const response: ISrkResponse<INameCheckPayload> = await this.api({
        method: "post",
        url: "/api/auth/ncheck",
        data: {
          type: "dn",
          name: this.displayName,
        } as NameCheckDto,
      });

      if (!response.ok) {
        return response.error.message || response.error.name;
      }

      if (!response.payload.isAvailable) {
        return "Display name is not available.";
      }

      return "";
    },
    async onSubmit() {
      this.isLoading = true;
      const response: ISrkResponse<IMemberRegisterPayload> = await this.api({
        method: "post",
        url: "/api/auth/register",
        data: {
          username: this.username,
          displayName: this.displayName,
          email: this.email,
          password: this.password,
        } as MemberRegistrationDto,
      });

      this.isLoading = false;

      if (response.ok) {
        if (response.payload.verificationRequired) {
          this.$router.push({
            path: "/verify/token",
            query: {
              otpToken: response.payload.otpToken,
            },
          });
        } else {
          return this.$router.redirect({
            path: "/verify/success",
            params: {
              otpToken: response.payload.otpToken,
            },
          });
        }
      }
    },
    ...mapActions({ api: "api/send" }),
  },
});
</script>

<style lang="less" scoped></style>

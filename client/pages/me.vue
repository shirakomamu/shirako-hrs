<template>
  <div class="space-y-8">
    <h5 class="text-4xl dark:text-white">My account</h5>
    <div class="grid grid-cols-1 justify-center gap-4">
      <div
        v-if="!emailVerified"
        class="
          grid grid-cols-1
          w-full
          gap-8
          items-center
          bg-gray-200
          dark:bg-gray-700
          p-8
          bg-opacity-50
        "
      >
        <p>
          Your email address is currently unverified. Please verify your email
          address to continue.
        </p>
        <div class="flex flex-row items-center gap-4">
          <ComboButton
            type="button"
            class="text-sm bg-black dark:bg-white text-white dark:text-black"
            alt="Resend verification email"
            :loading="isSendingVerificationEmail"
            :disabled="isSendingVerificationEmail"
            @click="resendVerificationEmail"
          >
            Resend verification email
          </ComboButton>
          <p>
            {{ verificationEmailMessage }}
          </p>
        </div>
      </div>

      <h6 class="text-2xl dark:text-white">Account information</h6>
      <div
        class="
          grid grid-cols-1
          sm:grid-cols-2
          w-full
          gap-8
          items-center
          bg-gray-200
          dark:bg-gray-700
          p-8
        "
      >
        <div class="avatar-container text-center space-y-4">
          <img
            :src="avatar"
            class="profile-avatar rounded-full mx-auto"
            alt="avatar"
            width="150"
            height="150"
          />
          <p class="text-gray-600 dark:text-gray-400">
            (Sorry, profile picture isn't customizable at this time.)
          </p>
        </div>
        <div class="grid grid-cols-1 gap-4 flex-grow w-full sm:w-auto">
          <div class="grid grid-cols-1 gap-1">
            <label class="text-lg font-semibold dark:text-white">User ID</label>
            <div class="text-sm w-full font-mono">
              {{ id }}
            </div>
            <div class="text-xs opacity-50">
              Your ID uniquely identifies you in our system and cannot be
              changed. It is not visible to anyone except you.
            </div>
          </div>

          <div class="grid grid-cols-1 gap-1">
            <label :for="userUid" class="text-lg font-semibold dark:text-white"
              >Username</label
            >
            <div v-if="!isUsernameEditing" class="text-sm w-full">
              <button
                type="button"
                class="p-0"
                alt="Change username"
                @click="showUsernameEditor(true)"
              >
                {{ username }}
                <Edit v-if="emailVerified" class="icon-inline" />
              </button>
            </div>
            <Input
              v-else
              :id="userUid"
              ref="userInput"
              v-model="usernameDraft"
              type="text"
              name="username"
              classes="p-2 text-sm w-full"
              passive-text="Your username allows other people to find you, if your profile is set to public."
              required
              :disabled="isUsernameLoading"
              @keyup.esc.prevent="showUsernameEditor(false)"
              @keyup.enter.prevent="showUsernameEditor(false)"
              @blur.prevent="showUsernameEditor(false)"
            />
            <p v-if="isUsernameEditing" class="text-xs text-red-500">
              If you change your username, your browsing session will be
              refreshed.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-1">
            <label
              :for="nicknameUid"
              class="text-lg font-semibold dark:text-white"
              >Nickname</label
            >
            <div v-if="!isNicknameEditing" class="text-sm w-full">
              <button
                type="button"
                class="p-0"
                alt="Change nickname"
                @click="showNicknameEditor(true)"
              >
                {{ nickname }}
                <Edit v-if="emailVerified" class="icon-inline" />
              </button>
            </div>
            <Input
              v-else
              :id="nicknameUid"
              ref="nicknameInput"
              v-model="nicknameDraft"
              type="text"
              name="nickname"
              classes="p-2 text-sm w-full"
              passive-text="Your nickname identifies you publicly, even to people not on your friends list."
              required
              :disabled="isNicknameLoading"
              @keyup.esc.prevent="showNicknameEditor(false)"
              @keyup.enter.prevent="showNicknameEditor(false)"
              @blur.prevent="showNicknameEditor(false)"
            />
          </div>

          <div class="grid grid-cols-1 gap-1">
            <label :for="emailUid" class="text-lg font-semibold dark:text-white"
              >Email address</label
            >
            <div v-if="!isEmailEditing" class="text-sm w-full">
              <button
                type="button"
                class="p-0"
                alt="Change email address"
                @click="showEmailEditor(true)"
              >
                {{ email }}
                <Edit class="icon-inline" />
              </button>
            </div>
            <Input
              v-else
              :id="emailUid"
              ref="emailInput"
              v-model="emailDraft"
              type="text"
              name="email"
              classes="p-2 text-sm w-full"
              passive-text="Your email is used to contact you about your account information, and only you can see it. If you change it, the new email address must be re-verified."
              required
              :disabled="isEmailLoading"
              @keyup.esc.prevent="showEmailEditor(false)"
              @keyup.enter.prevent="showEmailEditor(false)"
              @blur.prevent="showEmailEditor(false)"
            />
          </div>

          <div class="grid grid-cols-1 gap-1">
            <label class="text-lg font-semibold dark:text-white"
              >Password</label
            >
            <div class="w-full space-x-2">
              <ComboButton
                type="button"
                class="
                  text-sm
                  bg-black
                  dark:bg-white
                  text-white
                  dark:text-black
                "
                alt="Reset password"
                :loading="isSendingPasswordReset"
                :disabled="isSendingPasswordReset || passwordResetMessage"
                @click="requestPasswordReset"
              >
                Reset password
              </ComboButton>
              <span>{{ passwordResetMessage }}</span>
            </div>
            <div class="text-xs opacity-50">
              A link to reset your password will be sent to your email address.
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center gap-4 col-span-full">
          <div class="flex-grow" />
          <ComboButton
            type="button"
            alt="Sign out"
            class="text-sm text-red-500 border border-red-500"
            @click="signOut"
            >Sign out</ComboButton
          >
        </div>
      </div>

      <h6 class="text-2xl dark:text-white">Privacy settings</h6>
      <div
        class="
          grid grid-cols-1
          w-full
          gap-8
          items-center
          bg-gray-200
          dark:bg-gray-700
          p-8
        "
      >
        <div class="flex flex-row items-center gap-4">
          <div class="flex-grow">
            <label
              class="font-semibold dark:text-white"
              :for="friendRequestPrivacyUid"
              >Who can send you a friend request?</label
            >
            <p class="text-sm">
              Choose who can add you as a friend using your username.
            </p>
          </div>
          <select
            :id="friendRequestPrivacyUid"
            v-model="friendRequestPrivacySelection"
            class="p-2 text-sm"
            :disabled="!emailVerified"
          >
            <option
              v-for="(option, index) in friendRequestPrivacyOptions"
              :key="index"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="flex flex-row items-center gap-4">
          <div class="flex-grow">
            <label
              class="font-semibold dark:text-white"
              :for="defaultListVisibilityUid"
              >Default list visibility</label
            >
            <p class="text-sm">
              Choose the default visibility setting for newly-created lists.
            </p>
          </div>
          <select
            :id="defaultListVisibilityUid"
            v-model="defaultListVisibilitySelection"
            class="p-2 text-sm"
            :disabled="!emailVerified"
          >
            <option
              v-for="(option, index) in defaultListVisibilityOptions"
              :key="index"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>

      <h6 class="text-2xl dark:text-white">Account controls</h6>
      <div
        class="
          grid grid-cols-1
          w-full
          gap-8
          items-center
          bg-gray-200
          dark:bg-gray-700
          p-8
        "
      >
        <div class="flex flex-row items-center gap-4">
          <div class="flex-grow">
            <label class="font-semibold dark:text-white"
              >Delete my account</label
            >
            <p class="text-sm">
              Delete your account permanently. Your lists will no longer be
              accessible to anyone.
            </p>
            <p class="text-sm text-red-500">
              Warning: This action cannot be undone!
            </p>
          </div>
          <ComboButton
            type="button"
            alt="Delete account"
            class="text-sm bg-red-500 text-white"
            :loading="isAccountDeleteLoading"
            :disabled="isAccountDeleteDisabled"
            @click="requestAccountDelete"
            >Delete account</ComboButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useMeta,
  useContext,
  computed,
  useStore,
} from "@nuxtjs/composition-api";
import { mapActions } from "vuex";
import uniqueId from "@@/common/utils/uniqueId";
import Edit from "client/components/icons/Edit.vue";
import ISrkResponse, {
  IResetPasswordPayload,
  IVerifyEmailPayload,
} from "@@/common/interfaces/api";
import { Role } from "src/services/hrbac";

export default defineComponent({
  components: {
    Edit,
  },
  setup() {
    const context = useContext();
    useMeta({ title: "My account | " + context.$config.appinfo.name });

    const uid = uniqueId();
    const userUid = "username-" + uid;
    const nicknameUid = "nickname-" + uid;
    const emailUid = "email-" + uid;
    const friendRequestPrivacyUid = "friend-privacy-" + uid;
    const defaultListVisibilityUid = "list-privacy-" + uid;

    // data
    const isSendingVerificationEmail = ref<boolean>(false);
    const verificationEmailMessage = ref<string | null>(null);

    const isSendingPasswordReset = ref<boolean>(false);
    const passwordResetMessage = ref<string | null>(null);

    const isUsernameLoading = ref<boolean>(false);
    const isUsernameEditing = ref<boolean>(false);

    const isNicknameLoading = ref<boolean>(false);
    const isNicknameEditing = ref<boolean>(false);

    const isEmailLoading = ref<boolean>(false);
    const isEmailEditing = ref<boolean>(false);

    const isAccountDeleteDisabled = ref<boolean>(false);
    const isAccountDeleteLoading = ref<boolean>(false);

    const usernameDraft = ref<string | null>(null);
    const nicknameDraft = ref<string | null>(null);
    const emailDraft = ref<string | null>(null);

    const friendRequestPrivacyOptions = [
      {
        text: "No one",
        value: "none",
      },
      {
        text: "Anyone (default)",
        value: "anyone",
      },
    ];

    const defaultListVisibilityOptions = [
      {
        text: "List members (default)",
        value: "list",
      },
      {
        text: "Friends",
        value: "friends",
      },
      {
        text: "Anyone",
        value: "anyone",
      },
    ];

    const store = useStore();

    const user = store.getters["auth/actor"];

    // computed
    const avatar = computed((): string => user?.avatar);
    const id = computed((): string => user?.id);
    const username = computed((): string => user?.username);
    const nickname = computed((): string => user?.nickname);
    const email = computed((): string => user?.email);
    const emailVerified = computed(
      (): boolean => user?.roles.includes(Role._email_verified) || false
    );

    const friendRequestPrivacySelection = computed({
      get(): string | null {
        return user?.meta.privacySettings?.friendRequestPrivacy || null;
      },
      set(): void {
        console.log("Setting");
      },
    });

    const defaultListVisibilitySelection = computed({
      get(): string | null {
        return user?.meta.privacySettings?.defaultListVisibility || null;
      },
      set(): void {
        console.log("Setting");
      },
    });

    return {
      // static
      userUid,
      nicknameUid,
      emailUid,
      friendRequestPrivacyUid,
      defaultListVisibilityUid,

      // data
      isSendingVerificationEmail,
      verificationEmailMessage,
      isSendingPasswordReset,
      passwordResetMessage,
      isUsernameLoading,
      isUsernameEditing,
      isNicknameLoading,
      isNicknameEditing,
      isEmailLoading,
      isEmailEditing,
      isAccountDeleteDisabled,
      isAccountDeleteLoading,
      usernameDraft,
      nicknameDraft,
      emailDraft,
      friendRequestPrivacyOptions,
      defaultListVisibilityOptions,

      // computed
      avatar,
      id,
      username,
      nickname,
      email,
      emailVerified,
      friendRequestPrivacySelection,
      defaultListVisibilitySelection,
    };
  },
  // required for useMeta to work
  head: {},
  methods: {
    async showUsernameEditor(state: boolean = true) {
      this.isUsernameEditing = state;
      if (state) {
        this.usernameDraft = this.username;
        await this.$nextTick();
        (this.$refs.usernameInput as HTMLInputElement)?.focus();
      } else if (this.usernameDraft !== this.username) {
        const response = await this.api({
          method: "patch",
          url: "/api/auth/me",
          data: {
            username: this.usernameDraft,
          },
        });

        if (response.ok) {
          window.location.href = "/api/auth/login";
        }
      }
    },
    async showNicknameEditor(state: boolean = true) {
      this.isNicknameEditing = state;
      if (state) {
        this.nicknameDraft = this.nickname;
        await this.$nextTick();
        (
          document.querySelector("#" + this.nicknameUid) as HTMLInputElement
        )?.focus();
      } else if (this.nicknameDraft !== this.nickname) {
        const response = await this.api({
          method: "patch",
          url: "/api/auth/me",
          data: {
            nickname: this.nicknameDraft,
          },
        });

        if (response.ok) {
          await this.reidentify();
        }
      }
    },
    async showEmailEditor(state: boolean = true) {
      this.isEmailEditing = state;
      if (state) {
        this.emailDraft = this.email;
        await this.$nextTick();
        (
          document.querySelector("#" + this.emailUid) as HTMLInputElement
        )?.focus();
      } else if (this.emailDraft !== this.email) {
        const response = await this.api({
          method: "patch",
          url: "/api/auth/me",
          data: {
            email: this.emailDraft,
          },
        });

        if (response.ok) {
          await this.reidentify();
        }
      }
    },
    async resendVerificationEmail() {
      this.isSendingVerificationEmail = true;

      const response: ISrkResponse<IVerifyEmailPayload> = await this.api({
        method: "post",
        url: "/api/auth/me/verify_email",
      });

      this.isSendingVerificationEmail = false;

      if (response.ok) {
        this.verificationEmailMessage = `Verification email sent.`;
      } else {
        this.verificationEmailMessage = `Error: ${response.error.message}`;
      }
    },
    async requestPasswordReset() {
      this.isSendingPasswordReset = true;

      const response: ISrkResponse<IResetPasswordPayload> = await this.api({
        method: "post",
        url: "/api/auth/me/reset_password",
      });

      this.isSendingPasswordReset = false;

      if (response.ok) {
        this.passwordResetMessage = `Password reset email sent.`;
      } else {
        this.passwordResetMessage = `Error: ${response.error.message}`;
      }
    },
    requestAccountDelete() {
      this.isAccountDeleteLoading = true;
    },
    signOut() {
      window.location.href = "/api/auth/logout";
    },
    ...mapActions({ api: "api/send", reidentify: "auth/fetch" }),
  },
});
</script>

<style lang="less" scoped>
.icon-inline {
  display: inline;
  position: relative;
  height: 1em;
  width: 1em;
  cursor: pointer;
}
.avatar-container {
  flex-grow: 0.5;
}
</style>

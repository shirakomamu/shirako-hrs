<template>
  <div class="space-y-8">
    <h5 class="text-4xl dark:text-white">My account</h5>
    <div class="grid grid-cols-1 justify-center gap-4">
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
                <Edit class="icon-inline" />
              </button>
            </div>
            <Input
              v-else
              :id="userUid"
              v-model="usernameDraft"
              type="text"
              name="username"
              classes="p-2 text-sm w-full"
              passive-text="Your username allows other people to find you, if your profile is set to public."
              required
              :disabled="isUsernameDisabled || isUsernameLoading"
              @keyup.esc.prevent="showUsernameEditor(false)"
              @blur.prevent="showUsernameEditor(false)"
            />
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
                <Edit class="icon-inline" />
              </button>
            </div>
            <Input
              v-else
              :id="nicknameUid"
              v-model="nicknameDraft"
              type="text"
              name="nickname"
              classes="p-2 text-sm w-full"
              passive-text="Your nickname identifies you publicly, even to people not on your friends list."
              required
              :disabled="isNicknameDisabled || isNicknameLoading"
              @keyup.esc.prevent="showNicknameEditor(false)"
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
                <Check class="icon-inline text-green-500" />
                {{ email }}
                <Edit class="icon-inline" />
              </button>
            </div>
            <Input
              v-else
              :id="emailUid"
              v-model="emailDraft"
              type="text"
              name="email"
              classes="p-2 text-sm w-full"
              passive-text="Your email is used to contact you about your account information, and only you can see it. If you change it, the new email address must be re-verified."
              required
              :disabled="isEmailDisabled || isEmailLoading"
              @keyup.esc.prevent="showEmailEditor(false)"
              @blur.prevent="showEmailEditor(false)"
            />
          </div>

          <div class="grid grid-cols-1 gap-1">
            <label class="text-lg font-semibold dark:text-white"
              >Password</label
            >
            <div class="w-full">
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
                :loading="isPasswordLoading"
                :disabled="isPasswordDisabled"
                @click="requestPasswordReset"
              >
                Reset password
              </ComboButton>
            </div>
            <div class="text-xs opacity-50">
              A link to reset your password will be sent to your email address.
            </div>
          </div>
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
            <label class="font-semibold dark:text-white" :for="deleteAccountUid"
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
            class="
              text-sm
              border border-red-500
              text-red-500
              hover:bg-red-500 hover:text-white
              focus:bg-red-500 focus:text-white
              transition
            "
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
import Vue from "vue";
import uniqueId from "@@/common/utils/uniqueId";
import Edit from "client/components/icons/Edit.vue";
import Check from "client/components/icons/Check.vue";
import { ActorDto } from "@@/common/dto/auth";
import { Role } from "src/services/hrbac";

export default Vue.extend({
  components: {
    Edit,
    Check,
  },
  data() {
    return {
      uid: uniqueId() as string,
      avatar: null as string | null,

      id: null as string | null,
      username: null as string | null,
      nickname: null as string | null,
      email: null as string | null,
      emailVerified: false as boolean,

      isUsernameDisabled: false as boolean,
      isUsernameLoading: false as boolean,
      isUsernameEditing: false as boolean,

      isNicknameDisabled: false as boolean,
      isNicknameLoading: false as boolean,
      isNicknameEditing: false as boolean,

      isEmailDisabled: false as boolean,
      isEmailLoading: false as boolean,
      isEmailEditing: false as boolean,

      isPasswordDisabled: false as boolean,
      isPasswordLoading: false as boolean,

      isAccountDeleteDisabled: false as boolean,
      isAccountDeleteLoading: false as boolean,

      usernameDraft: null as string | null,
      nicknameDraft: null as string | null,
      emailDraft: null as string | null,

      friendRequestPrivacySelection: null as string | null,
      friendRequestPrivacyOptions: [
        {
          text: "No one",
          value: "none",
        },
        {
          text: "Anyone (default)",
          value: "anyone",
        },
      ],

      defaultListVisibilitySelection: null as string | null,
      defaultListVisibilityOptions: [
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
      ],
    };
  },
  head() {
    return {
      title: "My account | " + this.$config.appinfo.name,
    };
  },
  computed: {
    user(): ActorDto | null {
      return this.$store.getters["auth/actor"];
    },
    userUid(): string {
      return "username-" + this.uid;
    },
    nicknameUid(): string {
      return "nickname-" + this.uid;
    },
    emailUid(): string {
      return "email-" + this.uid;
    },
    friendRequestPrivacyUid(): string {
      return "friend-privacy-" + this.uid;
    },
    defaultListVisibilityUid(): string {
      return "list-privacy-" + this.uid;
    },
    deleteAccountUid(): string {
      return "delete-account-" + this.uid;
    },
  },
  created() {
    this.avatar = this.user?.avatar || null;
    this.id = this.user?.id || null;
    this.username = this.user?.username || null;
    this.nickname = this.user?.nickname || null;
    this.email = this.user?.email || null;
    this.emailVerified =
      this.user?.roles.includes(Role._email_verified) || false;

    this.friendRequestPrivacySelection =
      this.user?.meta.privacySettings?.friendRequestPrivacy || null;
    this.defaultListVisibilitySelection =
      this.user?.meta.privacySettings?.defaultListVisibility || null;
  },
  methods: {
    showUsernameEditor(state: boolean = true) {
      this.usernameDraft = this.username;
      this.isUsernameEditing = state;
    },
    showNicknameEditor(state: boolean = true) {
      this.nicknameDraft = this.nickname;
      this.isNicknameEditing = state;
    },
    showEmailEditor(state: boolean = true) {
      this.emailDraft = this.email;
      this.isEmailEditing = state;
    },
    requestPasswordReset() {
      this.isPasswordLoading = true;
    },
    requestAccountDelete() {
      this.isAccountDeleteLoading = true;
    },
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

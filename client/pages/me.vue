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
            alt="Avatar"
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
            <label
              :for="usernameUid"
              class="text-lg font-semibold dark:text-white"
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
              v-show="isUsernameEditing"
              :id="usernameUid"
              ref="usernameInput"
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
          </div>

          <div class="grid grid-cols-1 gap-1">
            <label
              :for="nicknameUid"
              class="text-lg font-semibold dark:text-white"
              >Display name</label
            >
            <div v-if="!isNicknameEditing" class="text-sm w-full">
              <button
                type="button"
                class="p-0"
                alt="Change display name"
                @click="showNicknameEditor(true)"
              >
                {{ nickname }}
                <Edit v-if="emailVerified" class="icon-inline" />
              </button>
            </div>
            <Input
              v-show="isNicknameEditing"
              :id="nicknameUid"
              ref="nicknameInput"
              v-model="nicknameDraft"
              type="text"
              name="nickname"
              classes="p-2 text-sm w-full"
              passive-text="Your display name identifies you publicly, even to people not on your friends list."
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
              v-show="isEmailEditing"
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
            <div class="w-full">
              <ComboButton
                class="
                  text-sm
                  bg-black
                  dark:bg-white
                  text-white
                  dark:text-black
                  w-full
                  sm:w-auto
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
        <div class="flex flex-col sm:flex-row items-center gap-4">
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
          <p class="text-sm">{{ friendRequestPrivacyMessage }}</p>
          <select
            :id="friendRequestPrivacyUid"
            v-model="friendRequestPrivacySelection"
            class="p-2 text-sm w-full sm:w-auto"
            :disabled="!emailVerified"
            @click="friendRequestPrivacyMessage = ''"
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

        <div class="flex flex-col sm:flex-row items-center gap-4">
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
          <p class="text-sm">{{ defaultListVisibilityMessage }}</p>
          <select
            :id="defaultListVisibilityUid"
            v-model="defaultListVisibilitySelection"
            class="p-2 text-sm w-full sm:w-auto"
            :disabled="!emailVerified"
            @click="defaultListVisibilityMessage = ''"
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
        <div class="flex flex-col sm:flex-row items-center gap-4">
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
            alt="Delete account"
            class="text-sm bg-red-500 text-white w-full sm:w-auto"
            :loading="showDeleteConfirmationModal"
            :disabled="showDeleteConfirmationModal"
            @click="onShowDeleteConfirmationModal"
            >Delete account</ComboButton
          >
        </div>
      </div>
    </div>

    <Modal
      :visible="showDeleteConfirmationModal"
      container-class="p-8 w-full max-w-prose"
      @hide="showDeleteConfirmationModal = false"
    >
      <div class="p-8 bg-gray-200 dark:bg-gray-700 grid grid-cols-1 gap-4">
        <h6 class="text-lg font-semibold dark:text-white">
          Confirm account deletion
        </h6>
        <p>
          Are you sure you want to delete your account? This action cannot be
          reversed.
        </p>
        <p>
          Please type
          <span class="font-mono font-bold dark:text-white">{{
            username
          }}</span>
          to confirm.
        </p>
        <p v-if="emailVerified" class="text-sm opacity-50">
          You will receive a final email at {{ email }} confirming your account
          deletion.
        </p>
        <form @submit.prevent="requestAccountDelete">
          <Input
            v-model="deleteConfirmationDraft"
            type="text"
            classes="p-2 text-sm w-full"
          />
          <div class="grid grid-cols-2 mt-4 gap-4">
            <ComboButton
              alt="Cancel"
              class="text-sm border border-black dark:border-white"
              @click="showDeleteConfirmationModal = false"
              >Cancel</ComboButton
            >
            <ComboButton
              type="submit"
              alt="Confirm account deletion"
              class="text-sm bg-red-500 text-white"
              :loading="isAccountDeleteLoading"
              :disabled="
                isAccountDeleteDisabled || deleteConfirmationDraft !== username
              "
              >Delete account</ComboButton
            >
          </div>
        </form>
      </div>
    </Modal>
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
  nextTick,
  ComponentRenderProxy,
} from "@nuxtjs/composition-api";
import { mapActions } from "vuex";
import Edit from "client/components/icons/Edit.vue";
import uniqueId from "@@/common/utils/uniqueId";
import ISrkResponse, {
  IResetPasswordPayload,
  IUpdateUserPayload,
  IUpdateUserPrivacyPayload,
  IVerifyEmailPayload,
} from "@@/common/interfaces/api";
import { Role } from "src/services/hrbac";
import { ListVisibility, FriendRequestPrivacy } from "@@/common/enums";
import { ActorDto } from "@@/common/dto/auth";

export default defineComponent({
  components: {
    Edit,
  },
  setup() {
    const context = useContext();
    useMeta({ title: "My account | " + context.$config.appinfo.name });

    // refs
    const usernameInput = ref<null | ComponentRenderProxy<HTMLInputElement>>(
      null
    );
    const nicknameInput = ref<null | ComponentRenderProxy<HTMLInputElement>>(
      null
    );
    const emailInput = ref<null | ComponentRenderProxy<HTMLInputElement>>(null);

    const uid = uniqueId();
    const usernameUid = "username-" + uid;
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

    const friendRequestPrivacyMessage = ref<string>("");
    const defaultListVisibilityMessage = ref<string>("");

    const friendRequestPrivacyOptions = [
      {
        text: "No one",
        value: FriendRequestPrivacy.none,
      },
      {
        text: "Anyone",
        value: FriendRequestPrivacy.anyone,
      },
    ];

    const defaultListVisibilityOptions = [
      {
        text: "List members",
        value: ListVisibility.list,
      },
      {
        text: "Friends",
        value: ListVisibility.friends,
      },
      {
        text: "Anyone",
        value: ListVisibility.anyone,
      },
    ];

    const showDeleteConfirmationModal = ref<boolean>(false);
    const deleteConfirmationDraft = ref<string | null>(null);

    const store = useStore();
    const user = computed<ActorDto | null>(() => store.getters["auth/actor"]);

    // computed
    const avatar = computed((): string | null => user.value?.avatar || null);
    const id = computed((): string | null => user.value?.id || null);
    const username = computed(
      (): string | null => user.value?.username || null
    );
    const nickname = computed(
      (): string | null => user.value?.nickname || null
    );
    const email = computed((): string | null => user.value?.email || null);
    const emailVerified = computed(
      (): boolean => user.value?.roles.includes(Role._email_verified) || false
    );

    const friendRequestPrivacySelection = computed({
      get(): FriendRequestPrivacy {
        return user.value?.meta.privacySettings
          ?.friendRequestPrivacy as FriendRequestPrivacy;
      },
      async set(newValue: FriendRequestPrivacy): Promise<void> {
        store.commit(
          "auth/setActor",
          Object.assign({}, user.value, {
            meta: {
              ...user.value?.meta,
              privacySettings: {
                ...user.value?.meta.privacySettings,
                friendRequestPrivacy: newValue,
              },
            },
          })
        );
        const response: ISrkResponse<IUpdateUserPrivacyPayload> =
          await store.dispatch("api/send", {
            method: "patch",
            url: "/api/auth/me/preferences",
            data: {
              friendRequestPrivacy: newValue,
            },
          });

        if (response.ok) {
          friendRequestPrivacyMessage.value = "saved!";
          setTimeout(() => {
            friendRequestPrivacyMessage.value = "";
          }, 5000);
        }
        await store.dispatch("auth/fetch");
      },
    });

    const defaultListVisibilitySelection = computed({
      get(): ListVisibility {
        return user.value?.meta.privacySettings
          ?.defaultListVisibility as ListVisibility;
      },
      async set(newValue: ListVisibility): Promise<void> {
        store.commit(
          "auth/setActor",
          Object.assign({}, user.value, {
            meta: {
              ...user.value?.meta,
              privacySettings: {
                ...user.value?.meta.privacySettings,
                defaultListVisibility: newValue,
              },
            },
          })
        );
        const response: ISrkResponse<IUpdateUserPrivacyPayload> =
          await store.dispatch("api/send", {
            method: "patch",
            url: "/api/auth/me/preferences",
            data: {
              defaultListVisibility: newValue,
            },
          });

        if (response.ok) {
          defaultListVisibilityMessage.value = "saved!";
          setTimeout(() => {
            defaultListVisibilityMessage.value = "";
          }, 5000);
        }
        await store.dispatch("auth/fetch");
      },
    });

    // methods
    const showUsernameEditor = async (state: boolean = true) => {
      isUsernameEditing.value = state;
      if (state) {
        usernameDraft.value = username.value;
        await nextTick();
        if (!usernameInput.value?.$refs.inputElem) return;
        (usernameInput.value.$refs.inputElem as HTMLInputElement)?.focus();
      } else if (usernameDraft.value !== username.value) {
        const response: ISrkResponse<IUpdateUserPayload> = await store.dispatch(
          "api/send",
          {
            method: "patch",
            url: "/api/auth/me",
            data: {
              username: usernameDraft.value,
            },
          }
        );

        if (response.ok) {
          await store.dispatch("auth/fetch");
        }
      }
    };

    const showNicknameEditor = async (state: boolean = true) => {
      isNicknameEditing.value = state;
      if (state) {
        nicknameDraft.value = nickname.value;
        await nextTick();
        if (!nicknameInput.value?.$refs.inputElem) return;
        (nicknameInput.value.$refs.inputElem as HTMLInputElement)?.focus();
      } else if (nicknameDraft.value !== nickname.value) {
        const response: ISrkResponse<IUpdateUserPayload> = await store.dispatch(
          "api/send",
          {
            method: "patch",
            url: "/api/auth/me",
            data: {
              nickname: nicknameDraft.value,
            },
          }
        );

        if (response.ok) {
          await store.dispatch("auth/fetch");
        }
      }
    };

    const showEmailEditor = async (state: boolean = true) => {
      isEmailEditing.value = state;
      if (state) {
        emailDraft.value = email.value;
        await nextTick();
        if (!emailInput.value?.$refs.inputElem) return;
        (emailInput.value.$refs.inputElem as HTMLInputElement)?.focus();
      } else if (emailDraft.value !== email.value) {
        const response: ISrkResponse<IUpdateUserPayload> = await store.dispatch(
          "api/send",
          {
            method: "patch",
            url: "/api/auth/me",
            data: {
              email: emailDraft.value,
            },
          }
        );

        if (response.ok) {
          await store.dispatch("auth/fetch");
        }
      }
    };

    const resendVerificationEmail = async () => {
      isSendingVerificationEmail.value = true;

      const response: ISrkResponse<IVerifyEmailPayload> = await store.dispatch(
        "api/send",
        {
          method: "post",
          url: "/api/auth/me/verify_email",
        }
      );

      isSendingVerificationEmail.value = false;

      if (response.ok) {
        verificationEmailMessage.value = `Verification email sent.`;
      } else {
        verificationEmailMessage.value = `Error: ${response.error.message}`;
      }
    };

    const requestPasswordReset = async () => {
      isSendingPasswordReset.value = true;

      const response: ISrkResponse<IResetPasswordPayload> =
        await store.dispatch("api/send", {
          method: "post",
          url: "/api/auth/me/reset_password",
        });

      isSendingPasswordReset.value = false;

      if (response.ok) {
        passwordResetMessage.value = `Password reset email sent.`;
      } else {
        passwordResetMessage.value = `Error: ${response.error.message}`;
      }
    };

    // todo: add confirmation
    const requestAccountDelete = async () => {
      isAccountDeleteLoading.value = true;

      const response: ISrkResponse<undefined> = await store.dispatch(
        "api/send",
        {
          method: "delete",
          url: "/api/auth/me",
        }
      );

      isAccountDeleteLoading.value = false;

      if (response.ok) {
        signOut();
      }
    };

    const onShowDeleteConfirmationModal = () => {
      showDeleteConfirmationModal.value = true;
      deleteConfirmationDraft.value = null;
    };

    const signOut = () => {
      window.location.href = "/api/auth/logout";
    };

    return {
      usernameInput,
      nicknameInput,
      emailInput,

      // static
      usernameUid,
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
      friendRequestPrivacyMessage,
      defaultListVisibilityMessage,
      friendRequestPrivacyOptions,
      defaultListVisibilityOptions,
      showDeleteConfirmationModal,
      deleteConfirmationDraft,

      // computed
      user,
      avatar,
      id,
      username,
      nickname,
      email,
      emailVerified,
      friendRequestPrivacySelection,
      defaultListVisibilitySelection,

      // methods
      showUsernameEditor,
      showNicknameEditor,
      showEmailEditor,
      resendVerificationEmail,
      requestPasswordReset,
      requestAccountDelete,
      signOut,
      onShowDeleteConfirmationModal,
    };
  },
  // required for useMeta to work
  head: {},
  methods: {
    ...mapActions({ api: "api/send", reidentify: "auth/fetch" }),
  },
});
</script>

<style lang="less" scoped>
.icon-inline {
  display: inline;
  height: 1.2em;
  width: 1.2em;
  cursor: pointer;
  position: relative;
  top: -2px;
}
.avatar-container {
  flex-grow: 0.5;
}
</style>

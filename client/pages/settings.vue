<template>
  <div>
    <div class="space-y-8 w-full max-w-screen-lg mx-auto">
      <h5 class="text-4xl dark:text-white">Settings</h5>
      <div class="grid grid-cols-1 justify-center gap-4">
        <div
          v-if="!emailVerified"
          class="
            grid grid-cols-1
            gap-4
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

          <p class="text-orange-srk text-sm italic">
            * Verification status may take up to 10 minutes to update.
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
              <label class="text-lg font-semibold dark:text-white"
                >User ID</label
              >
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
                passive-text="Your username allows other people to find you."
                minlength="1"
                maxlength="24"
                required
                :disabled="isUsernameLoading"
                :do-validation="true"
                :validator="usernameValidator"
                @keyup.esc.prevent="showUsernameEditor(false, false)"
                @keyup.enter.prevent="showUsernameEditor(false)"
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
                passive-text="Choose a nickname to show on your profile."
                minlength="1"
                maxlength="24"
                required
                :disabled="isNicknameLoading"
                :do-validation="true"
                @keyup.esc.prevent="showNicknameEditor(false, false)"
                @keyup.enter.prevent="showNicknameEditor(false)"
                @blur.prevent="showNicknameEditor(false)"
              />
            </div>

            <div class="grid grid-cols-1 gap-1">
              <label
                :for="emailUid"
                class="text-lg font-semibold dark:text-white"
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
                type="email"
                name="email"
                classes="p-2 text-sm w-full"
                passive-text="Your email is used to contact you about your account information, and only you can see it. If you change it, the new email address must be re-verified."
                required
                :disabled="isEmailLoading"
                :do-validation="true"
                @keyup.esc.prevent="showEmailEditor(false, false)"
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
                A link to reset your password will be sent to your email
                address.
              </div>
            </div>
          </div>
        </div>

        <h6 class="text-2xl dark:text-white">Privacy settings</h6>
        <div
          class="
            grid grid-cols-1
            gap-8
            items-center
            bg-gray-200
            dark:bg-gray-700
            p-8
          "
        >
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <div class="flex-grow">
              <label
                class="font-semibold dark:text-white"
                :for="friendRequestPrivacyUid"
                >Who can send you a friend request?</label
              >
              <p class="text-sm">Choose who can add you as a friend.</p>
            </div>
            <p v-if="friendRequestPrivacyMessage" class="text-sm">
              {{ friendRequestPrivacyMessage }}
            </p>
            <select
              :id="friendRequestPrivacyUid"
              ref="friendRequestPrivacySelect"
              v-model="friendRequestPrivacySelection"
              class="p-2 text-sm w-full sm:w-auto"
              :disabled="!emailVerified || isFriendRequestPrivacyLoading"
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

          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
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
            <p v-if="defaultListVisibilityMessage" class="text-sm">
              {{ defaultListVisibilityMessage }}
            </p>
            <select
              :id="defaultListVisibilityUid"
              ref="defaultListVisibilitySelect"
              v-model="defaultListVisibilitySelection"
              class="p-2 text-sm w-full sm:w-auto"
              :disabled="!emailVerified || isDefaultListVisibilityLoading"
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

        <h6 class="text-2xl dark:text-white">Location settings</h6>
        <div
          class="
            grid grid-cols-1
            gap-8
            items-center
            bg-gray-200
            dark:bg-gray-700
            p-8
          "
        >
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <div class="flex-grow">
              <label
                class="font-semibold dark:text-white"
                :for="defaultLocationUid"
                >Default location</label
              >
              <p class="text-sm">
                Used when searching for restaurants. You can use an address,
                city name, or ZIP code.
              </p>
            </div>
            <p v-if="defaultLocationMessage" class="text-sm">
              {{ defaultLocationMessage }}
            </p>
            <Input
              :id="defaultLocationUid"
              ref="defaultLocationInput"
              v-model="defaultLocationDraft"
              type="text"
              name="defaultLocation"
              classes="p-2 text-sm w-full"
              min="0"
              max="64"
              passive-text="Your default location is not shared with anyone."
              required
              :disabled="isDefaultLocationLoading"
              :do-validation="true"
              @keyup.esc.prevent="processDefaultLocation(false)"
              @keyup.enter.prevent="processDefaultLocation(true)"
              @blur.prevent="processDefaultLocation(true)"
            />
          </div>
        </div>

        <h6 class="text-2xl dark:text-white">Account controls</h6>
        <div
          class="
            grid grid-cols-1
            gap-8
            items-center
            bg-gray-200
            dark:bg-gray-700
            p-8
          "
        >
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <div class="flex-grow">
              <label class="font-semibold dark:text-white">API access</label>
              <p class="text-sm">
                Use a bearer token to access your account programatically. Note:
                Undocumented APIs may change without notice at any time.
              </p>
            </div>
            <Loader v-if="isApiStateLoading" class="icon-inline" />
            <template v-else>
              <ComboButton
                v-if="!tokenCreatedOn"
                alt="Create token"
                class="text-sm bg-blue-srk text-white w-full sm:w-auto"
                :loading="isCreatingApiToken"
                :disabled="!emailVerified || isCreatingApiToken"
                @click="createApiToken"
                >Create token</ComboButton
              >
              <template v-else>
                <ComboButton
                  alt="Refresh token"
                  class="text-sm bg-orange-srk text-white w-full sm:w-auto"
                  :loading="isCreatingApiToken"
                  :disabled="
                    !emailVerified || isCreatingApiToken || isDeletingApiToken
                  "
                  @click="createApiToken"
                  >Refresh token</ComboButton
                >
                <ComboButton
                  alt="Delete token"
                  class="text-sm bg-red-500 text-white w-full sm:w-auto"
                  :loading="isDeletingApiToken"
                  :disabled="
                    !emailVerified || isCreatingApiToken || isDeletingApiToken
                  "
                  @click="deleteApiToken"
                  >Delete token</ComboButton
                >
              </template>
            </template>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
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
        :visible="showApiKeyModal"
        container-class="p-8 grid grid-cols-1 place-items-center"
        @hide="onCloseApiKeyModal"
      >
        <div class="p-8 bg-gray-200 dark:bg-gray-700 grid grid-cols-1 gap-4">
          <h6 class="text-lg font-semibold dark:text-white">API key created</h6>
          <p>Your API key has been created.</p>
          <Drop
            :visible="copyKeyPopupVisible"
            container-class="p-4 drop-bottom drop-right bg-gray-100 dark:bg-gray-800 filter drop-shadow-lg"
            :close-after="2000"
            @hide="copyKeyPopupVisible = false"
          >
            <template #default>
              <pre
                class="
                  text-xs
                  bg-black
                  text-white
                  bg-opacity-50
                  p-2
                  overflow-x-auto overflow-y-hidden
                "
              ><button type="button" alt="Copy to clipboard" class="p-0 mr-2" @click="copyApiKeyToClipboard"><ContentCopy class="icon-inline" /></button>{{ apiKeyValue }}</pre>
            </template>
            <template #tooltip>
              <p class="text-xs">Token copied to clipboard.</p>
            </template>
          </Drop>
          <p>
            Include it as an
            <span class="font-semibold font-mono">Authorization</span> header in
            your HTTP requests:
          </p>
          <pre
            class="
              text-xs
              bg-black
              text-white
              bg-opacity-50
              p-2
              overflow-x-auto overflow-y-hidden
            "
          >
Authorization: Bearer {{ apiKeyValue }}</pre
          >
          <p>Please store this key securely. It will not be shown again.</p>
          <p class="text-orange-srk">
            This API key grants access to your entire account!
          </p>
        </div>
      </Modal>

      <Modal
        :visible="showDeleteConfirmationModal"
        container-class="p-8 w-full max-w-prose grid grid-cols-1 place-items-center"
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
            You will receive a final email at {{ email }} confirming your
            account deletion.
          </p>
          <form @submit.prevent="requestAccountDelete">
            <Input
              ref="deleteConfirmationInput"
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
                  isAccountDeleteDisabled ||
                  deleteConfirmationDraft !== username
                "
                >Delete account</ComboButton
              >
            </div>
          </form>
        </div>
      </Modal>
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
  nextTick,
  useStore,
  watch,
  onMounted,
} from "@nuxtjs/composition-api";
import ContentCopy from "client/components/icons/ContentCopy.vue";
import Edit from "client/components/icons/Edit.vue";
import Loader from "client/components/icons/Loader.vue";
import Input from "client/components/Input.vue";
import uniqueId from "common/utils/uniqueId";
import {
  ISrkResponse,
  IResetPasswordPayload,
  IUpdateUserPayload,
  IVerifyEmailPayload,
  ICheckApiKeyPayload,
  ICreateApiKeyPayload,
} from "common/types/api";
import { ListVisibility, FriendRequestPrivacy } from "common/enums";
import { Role } from "common/enums/hrbac";
import { Guard } from "common/types/hrbac";
import useSelf from "client/composables/useSelf";
import useListVisibilityOptions from "client/composables/useListVisibilityOptions";
import hrbacCan from "common/utils/hrbacCan";
import useInternalApi from "client/composables/useInternalApi";
import {
  Auth0UserMetadataDto,
  UpdateUserDto,
  UpdateUserLocationDto,
} from "common/dto/auth";

export default defineComponent({
  components: {
    ContentCopy,
    Edit,
    Loader,
  },

  meta: {
    guard: {
      roles: [Role._self_profile],
    } as Guard,
  },
  setup() {
    const context = useContext();
    const self = useSelf();
    const store = useStore();
    useMeta({
      title: "Settings | " + context.$config.appinfo.name,
    });
    const api = useInternalApi();

    // refs
    const usernameInput = ref<null | InstanceType<typeof Input>>(null);
    const nicknameInput = ref<null | InstanceType<typeof Input>>(null);
    const emailInput = ref<null | InstanceType<typeof Input>>(null);
    const friendRequestPrivacySelect = ref<null | HTMLSelectElement>(null);
    const defaultListVisibilitySelect = ref<null | HTMLSelectElement>(null);
    const defaultLocationInput = ref<null | InstanceType<typeof Input>>(null);
    const deleteConfirmationInput = ref<null | InstanceType<typeof Input>>(
      null
    );

    const uid = uniqueId();
    const usernameUid = "username-" + uid;
    const nicknameUid = "nickname-" + uid;
    const emailUid = "email-" + uid;
    const friendRequestPrivacyUid = "friend-privacy-" + uid;
    const defaultListVisibilityUid = "list-privacy-" + uid;
    const defaultLocationUid = "default-location-" + uid;

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

    const isFriendRequestPrivacyLoading = ref<boolean>(false);
    const isDefaultListVisibilityLoading = ref<boolean>(false);
    const isDefaultLocationLoading = ref<boolean>(false);

    const isAccountDeleteDisabled = ref<boolean>(false);
    const isAccountDeleteLoading = ref<boolean>(false);

    const usernameDraft = ref<string | null>(null);
    const nicknameDraft = ref<string | null>(null);
    const emailDraft = ref<string | null>(null);

    const friendRequestPrivacyMessage = ref<string>("");
    const defaultListVisibilityMessage = ref<string>("");
    const defaultLocationMessage = ref<string>("");

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

    const defaultListVisibilityOptions = useListVisibilityOptions();

    const showDeleteConfirmationModal = ref<boolean>(false);
    const deleteConfirmationDraft = ref<string | null>(null);

    // computed
    const avatar = computed((): string | null => self.value?.avatar || null);
    const id = computed((): string | null => self.value?.id || null);
    const username = computed(
      (): string | null => self.value?.username || null
    );
    const nickname = computed(
      (): string | null => self.value?.nickname || null
    );
    const email = computed((): string | null => self.value?.email || null);
    const emailVerified = computed(
      (): boolean => self.value?.roles.includes(Role._email_verified) || false
    );
    const defaultLocation = computed(
      (): string | null =>
        self.value?.meta.locationSettings?.defaultLocation || null
    );
    const defaultLocationDraft = ref<string | null>(defaultLocation.value);

    watch(defaultLocation, (newValue) => {
      defaultLocationDraft.value = newValue;
    });

    const friendRequestPrivacySelection = computed({
      get(): FriendRequestPrivacy {
        return self.value?.meta.privacySettings
          ?.friendRequestPrivacy as FriendRequestPrivacy;
      },
      async set(newValue: FriendRequestPrivacy): Promise<void> {
        isFriendRequestPrivacyLoading.value = true;
        store.commit(
          "auth/setActor",
          Object.assign({}, self.value, {
            meta: {
              ...self.value?.meta,
              privacySettings: {
                ...self.value?.meta.privacySettings,
                friendRequestPrivacy: newValue,
              },
            },
          })
        );
        const response = await api<IUpdateUserPayload>({
          method: "patch",
          url: "/api/auth/me/preferences",
          data: {
            privacySettings: {
              friendRequestPrivacy: newValue,
            },
          } as Auth0UserMetadataDto,
        });

        if (response.ok) {
          friendRequestPrivacyMessage.value = "saved!";
          setTimeout(() => {
            friendRequestPrivacyMessage.value = "";
          }, 5000);
        }
        await store.dispatch("auth/fetch");
        isFriendRequestPrivacyLoading.value = false;
      },
    });

    const defaultListVisibilitySelection = computed({
      get(): ListVisibility {
        return self.value?.meta.privacySettings
          ?.defaultListVisibility as ListVisibility;
      },
      async set(newValue: ListVisibility): Promise<void> {
        isDefaultListVisibilityLoading.value = true;
        store.commit(
          "auth/setActor",
          Object.assign({}, self.value, {
            meta: {
              ...self.value?.meta,
              privacySettings: {
                ...self.value?.meta.privacySettings,
                defaultListVisibility: newValue,
              },
            },
          })
        );
        const response = await api<IUpdateUserPayload>({
          method: "patch",
          url: "/api/auth/me/preferences",
          data: {
            privacySettings: {
              defaultListVisibility: newValue,
            },
          } as Auth0UserMetadataDto,
        });

        if (response.ok) {
          defaultListVisibilityMessage.value = "saved!";
          setTimeout(() => {
            defaultListVisibilityMessage.value = "";
          }, 5000);
        }
        await store.dispatch("auth/fetch");
        isDefaultListVisibilityLoading.value = false;
      },
    });

    // methods
    const showUsernameEditor = async (
      state: boolean = true,
      doSubmit: boolean = true
    ) => {
      if (state) {
        isUsernameEditing.value = state;
        usernameDraft.value = username.value;
        await nextTick();
        usernameInput.value?.focus();
      } else if (doSubmit && usernameDraft.value !== username.value) {
        if (
          !(
            usernameInput.value?.$refs.inputElem as HTMLInputElement
          )?.checkValidity() ||
          usernameInput.value?.indicatorState !== "success"
        )
          return;

        isUsernameLoading.value = true;
        const response: ISrkResponse<IUpdateUserPayload> = await store.dispatch(
          "api/send",
          {
            method: "patch",
            url: "/api/auth/me",
            data: {
              username: usernameDraft.value,
            } as UpdateUserDto,
          }
        );

        if (response.ok) {
          await store.dispatch("auth/fetch");
          isUsernameEditing.value = state;
        } else if (usernameInput.value) {
          usernameInput.value.validationError =
            response.error.message || response.error.name;
        }
        isUsernameLoading.value = false;
      } else {
        isUsernameEditing.value = state;
      }
    };

    const showNicknameEditor = async (
      state: boolean = true,
      doSubmit: boolean = true
    ) => {
      if (state) {
        isNicknameEditing.value = state;
        nicknameDraft.value = nickname.value;
        await nextTick();
        nicknameInput.value?.focus();
      } else if (doSubmit && nicknameDraft.value !== nickname.value) {
        if (
          !(
            nicknameInput.value?.$refs.inputElem as HTMLInputElement
          )?.checkValidity() ||
          nicknameInput.value?.indicatorState !== "success"
        )
          return;

        isNicknameLoading.value = true;
        const response: ISrkResponse<IUpdateUserPayload> = await store.dispatch(
          "api/send",
          {
            method: "patch",
            url: "/api/auth/me",
            data: {
              nickname: nicknameDraft.value,
            } as UpdateUserDto,
          }
        );

        if (response.ok) {
          await store.dispatch("auth/fetch");
          isNicknameEditing.value = state;
        } else if (nicknameInput.value) {
          nicknameInput.value.validationError =
            response.error.message || response.error.name;
        }
        isNicknameLoading.value = false;
      } else {
        isNicknameEditing.value = state;
      }
    };

    const showEmailEditor = async (
      state: boolean = true,
      doSubmit: boolean = true
    ) => {
      if (state) {
        isEmailEditing.value = state;
        emailDraft.value = email.value;
        await nextTick();
        emailInput.value?.focus();
      } else if (doSubmit && emailDraft.value !== email.value) {
        if (
          !(
            emailInput.value?.$refs.inputElem as HTMLInputElement
          )?.checkValidity() ||
          emailInput.value?.indicatorState !== "success"
        )
          return;

        isEmailLoading.value = true;
        const response: ISrkResponse<IUpdateUserPayload> = await store.dispatch(
          "api/send",
          {
            method: "patch",
            url: "/api/auth/me",
            data: {
              email: emailDraft.value,
            } as UpdateUserDto,
          }
        );

        if (response.ok) {
          await store.dispatch("auth/fetch");
          isEmailEditing.value = state;
        } else if (emailInput.value) {
          emailInput.value.validationError =
            response.error.message || response.error.name;
        }
        isEmailLoading.value = false;
      } else {
        isEmailEditing.value = state;
      }
    };

    const processDefaultLocation = async (doSubmit: boolean = true) => {
      if (doSubmit && defaultLocationDraft.value !== defaultLocation.value) {
        if (
          !(
            defaultLocationInput.value?.$refs.inputElem as HTMLInputElement
          )?.checkValidity() ||
          defaultLocationInput.value?.indicatorState !== "success"
        ) {
          return;
        }

        isDefaultLocationLoading.value = true;
        const response: ISrkResponse<IUpdateUserPayload> = await store.dispatch(
          "api/send",
          {
            method: "patch",
            url: "/api/auth/me/preferences",
            data: {
              locationSettings: { defaultLocation: defaultLocationDraft.value },
            } as UpdateUserLocationDto,
          }
        );
        isDefaultLocationLoading.value = false;

        if (response.ok) {
          await store.dispatch("auth/fetch");
          defaultLocationInput.value.setTouched(false);
          defaultLocationMessage.value = "saved!";
          setTimeout(() => {
            defaultLocationMessage.value = "";
          }, 5000);
        }
      }
    };

    const protectedUsernames = [
      /^me$/i,
      /.{0,}mamu.{0,}/i,
      /.{0,}shirako.{0,}/i,
    ];
    const usernameValidator = (value: string) => {
      if (value.length < 1 || value.length > 24) {
        return "Username must be 1 to 24 characters long";
      }
      if (!/^[A-z0-9@^$.!`\-#+'~_]+$/.test(value)) {
        return "Username is limited to alphanumeric characters and the symbols [@, ^, $, ., !, `, -, #, +, ', ~, _]";
      }
      if (!hrbacCan({ roles: [Role._protected_usernames] }, self.value)) {
        if (protectedUsernames.some((e) => e.test(value))) {
          return "Username is reserved and cannot be used";
        }
      }

      return "";
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

    const onShowDeleteConfirmationModal = async () => {
      showDeleteConfirmationModal.value = true;
      deleteConfirmationDraft.value = null;

      await nextTick();
      deleteConfirmationInput.value?.focus();
    };

    const signOut = () => {
      window.location.href = "/api/auth/logout";
    };

    onMounted(() => identifyApiToken());

    const isApiStateLoading = ref<boolean>(true);
    const tokenCreatedOn = ref<number | null>(null);
    const isCreatingApiToken = ref<boolean>(false);
    const isDeletingApiToken = ref<boolean>(false);
    const apiKeyValue = ref<string | null>(null);
    const identifyApiToken = async () => {
      isApiStateLoading.value = true;
      const r = await api<ICheckApiKeyPayload>({
        method: "get",
        url: "/api/auth/me/apikey",
      });
      isApiStateLoading.value = false;

      if (r.ok) {
        tokenCreatedOn.value = r.payload.createdAt;
      }
    };
    const createApiToken = async () => {
      isCreatingApiToken.value = true;
      const r = await api<ICreateApiKeyPayload>({
        method: "post",
        url: "/api/auth/me/apikey",
      });
      isCreatingApiToken.value = false;

      if (r.ok) {
        tokenCreatedOn.value = r.payload.createdAt;

        apiKeyValue.value = r.payload.key;
        showApiKeyModal.value = true;
      }
    };
    const deleteApiToken = async () => {
      isDeletingApiToken.value = true;
      const r = await api<void>({
        method: "delete",
        url: "/api/auth/me/apikey",
      });
      isDeletingApiToken.value = false;

      if (r.ok) {
        tokenCreatedOn.value = null;
      }
    };
    const showApiKeyModal = ref<boolean>(false);
    const onCloseApiKeyModal = () => {
      showApiKeyModal.value = false;
      apiKeyValue.value = null;
    };
    const copyApiKeyToClipboard = async () => {
      await navigator.clipboard.writeText(apiKeyValue.value || "");
      copyKeyPopupVisible.value = true;
    };
    const copyKeyPopupVisible = ref<boolean>(false);

    return {
      usernameInput,
      nicknameInput,
      emailInput,
      friendRequestPrivacySelect,
      defaultListVisibilitySelect,
      defaultLocationInput,
      deleteConfirmationInput,

      // static
      usernameUid,
      nicknameUid,
      emailUid,
      friendRequestPrivacyUid,
      defaultListVisibilityUid,
      defaultLocationUid,

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
      isFriendRequestPrivacyLoading,
      isDefaultListVisibilityLoading,
      isDefaultLocationLoading,
      isAccountDeleteDisabled,
      isAccountDeleteLoading,
      usernameDraft,
      nicknameDraft,
      emailDraft,
      defaultLocationDraft,
      friendRequestPrivacyMessage,
      defaultListVisibilityMessage,
      defaultLocationMessage,
      friendRequestPrivacyOptions,
      defaultListVisibilityOptions,
      showDeleteConfirmationModal,
      deleteConfirmationDraft,

      // computed
      self,
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
      processDefaultLocation,
      resendVerificationEmail,
      requestPasswordReset,
      requestAccountDelete,
      signOut,
      onShowDeleteConfirmationModal,
      usernameValidator,

      // api
      isApiStateLoading,
      tokenCreatedOn,
      isCreatingApiToken,
      isDeletingApiToken,
      identifyApiToken,
      createApiToken,
      deleteApiToken,
      showApiKeyModal,
      apiKeyValue,
      onCloseApiKeyModal,
      copyApiKeyToClipboard,
      copyKeyPopupVisible,
    };
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped>
.avatar-container {
  flex-grow: 0.5;
}
</style>

<template>
  <div class="space-y-8">
    <h5 class="text-4xl dark:text-white">Terms of service</h5>
    <p>
      By using this site, you agree to the policy set forth below. Please note
      that these terms may change at any time without notice.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">Jurisdiction</h6>
    <p>
      This site is operated under the jurisdiction of the United States. By
      using this site, you ascertain that you are of the age of majority in the
      United States or that you have the consent of a legal guardian.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">Service continuity</h6>
    <p>
      This site is provided as a hobby, not as a commercial product. Services
      provided by this site may be stopped or modified at any time and without
      notice.
    </p>
    <p>
      Furthermore, this site is only provisioned with a minimal amount of
      capacity. You may face storage errors once this service's capacity limit
      has been reached. In order to ensure that this service can continue to be
      functional regardless,
      <strong
        >data stored within this service may be erased at any time and without
        notice</strong
      >.
    </p>
    <p>
      We also reserve the right to terminate or suspend your account and/or its
      data at any time, with or without notice, and with or without reason.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">
      User-generated content
    </h6>
    <p>
      Certain content on this site are generated by users of this site and not
      by us. As such, we cannot guarantee the safety or accuracy of any of the
      user-generated content available on this site. You may report any content
      which you find objectionable or which violates the laws of the United
      States at the
      <nuxt-link
        to="/contact"
        class="
          text-orange-srk
          dark:text-blue-srk
          hover:underline
          focus:underline
        "
        >Contact us</nuxt-link
      >
      page.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, useMeta } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const context = useContext();
    useMeta({ title: "Terms of service | " + context.$config.appinfo.name });
  },
  head: {},
});
</script>

<style lang="less" scoped></style>

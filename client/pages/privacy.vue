<template>
  <div class="privacy-policy space-y-8 max-w-prose">
    <h5 class="text-4xl dark:text-white">Privacy policy</h5>
    <p>
      By using this site, you agree to the policy set forth below. Please note
      that these terms may change at any time without notice.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">Analytics</h6>
    <p>
      We do not use tracking cookies. We do not collect your metadata. We do not
      collect your data for analytics purposes.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">Account management</h6>
    <p>
      You do not have to create an account to use the facilities provided by
      this app. If you use this app without an account, data will be stored in
      your device storage instead. You may clear this data at any time by using
      your browser's settings.
    </p>
    <p>
      If you create an account or log into your account, we will store a cookie
      in your browser to authenticate your browser. This cookie is necessary for
      the functioning of this site. We will also store an identifying token in
      your browser's local storage so that we can automatically log you back in
      after session expiry. This cookie and token are erased upon logging out.
      You may also clear this data at any time by using your browser's settings.
    </p>
    <p>
      We ask you for your email address when you create an account, but it is
      not required. If you provide us your email address, we will only use it to
      recover your account. You may also manage or erase the email address for
      your account file through the
      <nuxt-link to="/me" class="text-blue-500 hover:underline focus:underline"
        >Manage account</nuxt-link
      >
      page.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">Cache</h6>
    <p>
      Some files may be stored in your browser's cache to allow this site to be
      accessible even when you do not have internet connectivity. Please note
      that certain functions may not be available while offline.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">
      Your personal information
    </h6>
    <p>
      We will take reasonable precautions to safeguard your personal
      information, and we will never transfer or disclose it to a third-party
      without your explicit consent.
    </p>
    <p>
      This site's hosting provider, Heroku by Salesforce, may log data necessary
      for the functioning of this site. Such data may include your browser
      metadata or IP address. Please see their privacy policy at
      <a
        href="https://www.salesforce.com/company/privacy/"
        class="hover:underline focus:underline text-blue-500"
        target="_blank"
        rel="noopener noreferrer"
        >https://www.salesforce.com/company/privacy/</a
      >
      for more information.
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {};
  },
  head() {
    return {
      title: "Privacy policy | " + this.$config.appinfo.name,
    };
  },
});
</script>

<style lang="less" scoped></style>

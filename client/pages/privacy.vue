<template>
  <div class="space-y-8">
    <h5 class="text-4xl dark:text-white">Privacy policy</h5>
    <p>
      By using this site, you agree to the policy set forth below. Please note
      that this policy may change at any time without notice.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">Analytics</h6>
    <p>
      We do not use tracking cookies. We do not collect your metadata. We do not
      collect your data for analytics purposes.
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
      Please note that other users of this app may see information that you make
      visible to them. Such information will be clearly labeled in their
      respective management areas. We do not take responsibility for misuse of
      information which you voluntarily make available to other users.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">Account management</h6>
    <p>
      You must create an account to use the facilities provided by this app.
      Account registration and authentication services for this app are provided
      by Auth0. Upon registration or logging in, you will be redirected from our
      site to Auth0. Please refer to their privacy policy at
      <a
        href="https://auth0.com/privacy"
        class="hover:underline focus:underline text-blue-srk"
        target="_blank"
        rel="noopener noreferrer"
        >https://auth0.com/privacy</a
      >
      for more information.
    </p>
    <p>
      We ask you for your email address when you create an account. We will only
      use it to recover your account. You may also manage or erase your account
      through the
      <nuxt-link to="/me" class="text-blue-srk hover:underline focus:underline"
        >Manage account</nuxt-link
      >
      page at any time. Please note that this action is irreversible.
    </p>
    <p>
      If you log into your account, we will store a cookie in your browser to
      authenticate your browser. This cookie is necessary for the functioning of
      this site. We will also store an identifying token in your browser's local
      storage so that we can automatically log you back in after session expiry.
      This cookie and token are erased upon logging out. You may also clear this
      data at any time by using your browser's settings.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">
      Use of the help center
    </h6>
    <p>
      We utilize Atlassian's Jira Service Management to provide basic help
      center services should you need to contact us regarding this app. Our help
      center is accessible through both the web and email. In either case, we
      require you to provide us an email address so that we can contact you
      back.
    </p>
    <p>
      Please note that in order to view the progress of your ticket through the
      web, you will be requested to create an account at our help center in
      Atlassian's systems. This account is separate from that managed by Auth0,
      and it will only be used to view your help center requests. If you do not
      wish to create an account through our help center, then correspondence
      will only be available via email.
    </p>
    <p>
      Please see their privacy policy at
      <a
        href="https://www.atlassian.com/legal/privacy-policy"
        class="hover:underline focus:underline text-blue-srk"
        target="_blank"
        rel="noopener noreferrer"
        >https://www.atlassian.com/legal/privacy-policy</a
      >
      for more information.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">Our service provider</h6>
    <p>
      This site's hosting provider, Heroku by Salesforce, may log data necessary
      for the functioning of this site. Such data may include your browser
      metadata or IP address. Please see their privacy policy at
      <a
        href="https://www.salesforce.com/company/privacy"
        class="hover:underline focus:underline text-blue-srk"
        target="_blank"
        rel="noopener noreferrer"
        >https://www.salesforce.com/company/privacy</a
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

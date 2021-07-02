<template>
  <div class="space-y-8">
    <h5 class="text-4xl dark:text-white">Privacy policy</h5>
    <p>
      By using this site, you agree to the policy set forth below. Please note
      that this policy may change at any time without notice.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">Analytics</h6>
    <p>
      We do not use tracking cookies nor do we collect your metadata beyond the
      minimum that is necessary for the functioning of our services. We do not
      collect your data for analytics or marketing purposes.
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
      use it to contact you regarding your account. You may also manage or erase
      your account through the
      <nuxt-link to="/me" class="text-blue-srk hover:underline focus:underline"
        >My account</nuxt-link
      >
      page at any time. These are some of the basic scenarios regarding which we
      may email you:
    </p>
    <ul class="pl-8 list-disc list-inside">
      <li>Email verification</li>
      <li>Account confirmation</li>
      <li>Password change request</li>
      <li>Account block alert</li>
      <li>Account security alert</li>
      <li>Account deletion</li>
    </ul>
    <p>
      If you log into your account, we will store a cookie in your browser to
      authenticate your browser. This cookie is erased upon logging out. You may
      also clear this data at any time by using your browser's settings.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">
      Use of the Help Center
    </h6>
    <p>
      We utilize Atlassian's Jira Service Management to provide basic help
      services should you need to contact us regarding this app. Our help center
      is accessible through both the web and email. In either case, we require
      you to provide us an email address so that we can contact you back.
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
import { defineComponent, useContext, useMeta } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const context = useContext();
    useMeta({ title: "Privacy policy | " + context.$config.appinfo.name });
  },
  head: {},
});
</script>

<style lang="less" scoped></style>

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ja from "javascript-time-ago/locale/ja";

TimeAgo.addLocale(ja);
TimeAgo.addDefaultLocale(en);

const getLanguage = () =>
  (navigator.languages &&
    navigator.languages.length &&
    navigator.languages[0]) ||
  navigator.language ||
  "en";

const timeAgo = new TimeAgo(getLanguage());

export default timeAgo;

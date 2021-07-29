import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ja from "javascript-time-ago/locale/ja";

TimeAgo.addLocale(ja);
TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo(["en-US", "ja-JP"]);

export default timeAgo;

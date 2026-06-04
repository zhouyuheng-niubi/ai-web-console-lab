import { Bubble as t, BubbleList as e } from "./bubble/index.js";
import n from "./container/index.js";
import i from "./conversations/index.js";
import m from "./dropdown-menu/index.js";
import a from "./feedback/index.js";
import p from "./history/index.js";
import u from "./icon-button/index.js";
import { Prompt as T, Prompts as f } from "./prompts/index.js";
import l from "./question/index.js";
import c from "./sender/index.js";
import g from "./welcome/index.js";
import b from "./suggestion/index.js";
import P from "./suggestion-popover/index.js";
import S, { SuggestionPillButton as d } from "./suggestion-pills/index.js";
const B = [
  t,
  e,
  n,
  i,
  m,
  a,
  p,
  u,
  T,
  f,
  l,
  c,
  g,
  b,
  P,
  S,
  d
], Q = {
  install(r) {
    B.forEach((o) => {
      const s = o.name.replace(/^Tiny/, "").replace(/^Tr/, "");
      r.component(`Tr${s}`, o);
    });
  }
};
export {
  t as Bubble,
  e as BubbleList,
  n as Container,
  i as Conversations,
  m as DropdownMenu,
  a as Feedback,
  p as History,
  u as IconButton,
  T as Prompt,
  f as Prompts,
  l as Question,
  c as Sender,
  b as Suggestion,
  d as SuggestionPillButton,
  S as SuggestionPills,
  P as SuggestionPopover,
  t as TrBubble,
  e as TrBubbleList,
  n as TrContainer,
  i as TrConversations,
  m as TrDropdownMenu,
  a as TrFeedback,
  p as TrHistory,
  u as TrIconButton,
  T as TrPrompt,
  f as TrPrompts,
  l as TrQuestion,
  c as TrSender,
  b as TrSuggestion,
  d as TrSuggestionPillButton,
  S as TrSuggestionPills,
  P as TrSuggestionPopover,
  g as TrWelcome,
  g as Welcome,
  Q as default
};

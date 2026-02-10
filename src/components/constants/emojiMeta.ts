import angry from "/assets/emoji/angry.gif";
import annoyed from "/assets/emoji/annoyed.gif";
import sad from "/assets/emoji/sad.gif";
//import shocked from "/assets/emoji/chocked.gif";
import worried from "/assets/emoji/worried.gif";
import coeur from "/assets/emoji/coeur.gif";
import clap from "/assets/emoji/clap.gif";
import like from "/assets/emoji/like.gif";
import hug from "/assets/emoji/hug.gif";
import love from "/assets/emoji/love.gif";
import mdr from "/assets/emoji/mdr.gif";

export type EmojiMeta = {
  label: string;
  gif: string;
};

export const EMOJI_META: Record<string, EmojiMeta> = {
  "😂": {
    label: "Trop drôle",
    gif: mdr,
  },
  "😍": {
    label: "Surprenant",
    gif: love,
  },
  "🤗": {
    label: "Câlin",
    gif: hug,
  },
  "👍": {
    label: "J’aime",
    gif: like,
  },
  "😡": {
    label: "Frustré",
    gif: angry,
  },
  "👏": {
    label: "Applaudissement",
    gif: clap,
  },
  "😒": {
    label: "Agacé",
    gif: annoyed,
  },
  "😢": {
    label: "Triste",
    gif: sad,
  },
  "😱": {
    label: "Choqué",
    gif: worried,
  },
  "😟": {
    label: "Inquiet",
    gif: worried,
  },
  "❤️": {
    label: "J’adore",
    gif: coeur,
  },
};

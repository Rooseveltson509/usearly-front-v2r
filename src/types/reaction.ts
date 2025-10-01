export interface UserReaction {
  userId: string;
  emoji: string;
  userPseudo?: string; // ✅ pseudo visible sur hover
  userAvatar?: string | null; // ✅ avatar visible sur hover
}

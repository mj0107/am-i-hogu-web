export type HoguLevel = "SAFE" | "CAUTIOUS" | "WARNING" | "RISKY" | "CRITICAL" | "NONE";

export type MypageUserResponse = {
  nickname: string;
  profileImageUrl: string | null;
  hoguIndex: number;
  hoguLevel: HoguLevel;
  hoguShortDescription: string;
};

export type MypageProfile = {
  nickname: string;
  avatarUrl?: string;
};

export type MypageProfileSummaryProps = {
  profile: MypageProfile;
  editable?: boolean;
  className?: string;
};

export type MypageProfileEditFormProps = {
  profile: MypageProfile;
};

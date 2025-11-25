import "./DoubleProfilePicture.scss";
import fakeAvatar1 from "/assets/icons/signal-head.svg";
import type { PropsDoubleProfilePicture } from "@src/types/profile";
import Avatar from "@src/components/shared/Avatar";

const DoubleProfilePicture = ({
  UserPicture = fakeAvatar1,
  PseudoUser = "UnknownUser",
  BrandPicture = fakeAvatar1,
  NameBrand = "UnknownBrand",
  pseudoVisible = true,
  maxLength = 10,
  cutLength = 5,
  sizeHW = 50,
}: PropsDoubleProfilePicture) => {
  const truncate = (s: string, max = maxLength, cut = cutLength) =>
    s.length > max ? `${s.slice(0, cut)}…` : s;

  const userLabel = truncate(PseudoUser);
  const brandLabel = truncate(NameBrand);

  return (
    <div className="signalement-post-minimal-pp">
      <div className="signalement-post-minimal-pp-photos">
        <div className="signalement-post-minimal-pp-photos-container">
          <Avatar
            sizeHW={sizeHW}
            avatar={UserPicture}
            pseudo={PseudoUser || "Utilisateur"}
            type="user"
            wrapperClassName="user-avatar"
          />
        </div>
        <div className="signalement-post-minimal-pp-photos-container">
          <Avatar
            sizeHW={sizeHW}
            avatar={BrandPicture}
            pseudo={NameBrand}
            type="brand"
            siteUrl={undefined}
            wrapperClassName="brand-logo"
          />
        </div>
      </div>
      {pseudoVisible && (
        <div
          className="signalement-post-minimal-pp-name"
          title={`${PseudoUser} × ${NameBrand}`} // full text au survol
        >
          {userLabel} × {brandLabel}
        </div>
      )}
    </div>
  );
};

export default DoubleProfilePicture;

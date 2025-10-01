import SideBarNav from "@src/pages/UserAccount/Components/SideBarNav/SideBarNav";
import UserAccountInformations from "@src/pages/UserAccount/pages/UserAccountInformations";
import "./UserAccount.scss";

const UserAccount = () => {
  return (
    <div className="user-account-container">
      <SideBarNav />
      <UserAccountInformations />
    </div>
  );
};

export default UserAccount;

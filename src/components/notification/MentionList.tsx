import React from "react";
import Avatar from "../shared/Avatar";
import "./MentionList.scss";

interface User {
  id: string;
  pseudo: string;
  avatar?: string | null;
}

interface Props {
  users: User[];
  onSelect: (user: User) => void;
}

const MentionList: React.FC<Props> = ({ users, onSelect }) => {
  return (
    <ul className="mention-list">
      {users.map((user) => (
        <li
          key={user.id}
          onClick={() => onSelect(user)}
          className="mention-item"
        >
          <Avatar
            avatar={user.avatar ?? null}
            type="user"
            pseudo={user.pseudo}
            className="mention-avatar"
          />
          <span className="mention-pseudo">@{user.pseudo}</span>
        </li>
      ))}
    </ul>
  );
};

export default MentionList;

import "./UserChallenge.scss";


interface Friend {
  name: string;
  handle: string;
  avatar: string;
  score: number;
  isUser?: boolean;
}

const friends: Friend[] = [
  {
    name: "Silvain",
    handle: "@silvainE",
    avatar: "/assets/images/profil/Silvain.png",
    score: 223,
  },
  {
    name: "Gregory",
    handle: "@greg007",
    avatar: "/assets/images/profil/Greg.png",
    score: 217,
  },
  {
    name: "Zaia",
    handle: "@zaiaK",
    avatar: "/assets/images/profil/Zaia.png",
    score: 189,
    isUser: true,
  },
    {
        name: "Alex", handle: "@alex12", avatar: "/assets/images/profil/Alex.png", 
    score: 56 },
];

const UserChallenge: React.FC = () => {
  return (
    <div className="user-challenge">
      <h2>
        <span className="emoji">👑</span> Classement hebdo
      </h2>

      <div className="user-challenge__banner">
        <span>🥇</span>
        <strong>Tu es dans le Top 3</strong> parmi tes amis !
      </div>

      <ul className="user-challenge__list">
        {friends.map((friend, idx) => (
          <li
            key={idx}
            className={`friend ${friend.isUser ? "current-user" : ""}`}
          >
            <div className="friend-info">
              <img src={friend.avatar} alt={friend.name} className="avatar" />
              <div>
                <strong>{friend.name}</strong>
                <span className="handle">{friend.handle}</span>
              </div>
            </div>
            <div className="score">{friend.score} U.</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserChallenge;

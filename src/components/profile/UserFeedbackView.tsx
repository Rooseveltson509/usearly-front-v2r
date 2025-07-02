import React from "react";
import InteractiveFeedbackCard from "@src/components/user-profile/InteractiveFeedbackCard";
import { useFetchUserFeedback } from "@src/hooks/useFetchUserFeedback";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import SqueletonAnime from "../loader/SqueletonAnime";

interface Props {
  activeTab: FeedbackType;
}

const UserFeedbackView: React.FC<Props> = ({ activeTab }) => {
  const { data, loading } = useFetchUserFeedback(activeTab);

  if (loading) {
    return (
      <SqueletonAnime loaderRef={{ current: null }} loading={true} hasMore={false} error={null} />
    );
  }

  if (!data.length) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Aucun contenu trouvé.</div>;
  }

  if (activeTab === "coupdecoeur") {
    return (
      <>
        {(data as CoupDeCoeur[]).map((item, index) => (
          <InteractiveFeedbackCard
            key={item.id || `feedback-${index}`}
            item={{
              ...item,
              type: "coupdecoeur",
            }}
          />
        ))}
      </>
    );
  }

  if (activeTab === "suggestion") {
    return (
      <>
        {(data as Suggestion[]).map((item, index) => (
          <InteractiveFeedbackCard
            key={item.id || `feedback-${index}`}
            item={{
              ...item,
              type: "suggestion",
            }}
          />
        ))}
      </>
    );
  }
};

export default UserFeedbackView;

import React from "react";
import HomeFiltersCdc from "../HomeFiltersCdc";
import FeedbackView from "@src/components/feedbacks/FeedbackView";
import FilterIllustration from "../home-illustration/FilterIllustration";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";

interface Props {
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  selectedBrand: string;
  setSelectedBrand: (b: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  brandBannerStyle: React.CSSProperties;
  coupDeCoeurCategories: string[];
  coupDeCoeursForDisplay: any[];
  isLoading: boolean;
}

const CdcTab: React.FC<Props> = ({
  activeFilter,
  setActiveFilter,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  brandBannerStyle,
  coupDeCoeurCategories,
  coupDeCoeursForDisplay,
  isLoading,
}) => {
  return (
    <div
      className={`cdc-banner-container ${selectedBrand ? "banner-filtered" : `banner-${activeFilter}`}`}
      style={brandBannerStyle}
    >
      <div className="feedback-list-wrapper">
        <HomeFiltersCdc
          filter={activeFilter}
          setFilter={setActiveFilter}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availableCategories={coupDeCoeurCategories}
        />
        {isLoading ? (
          <SqueletonAnime
            loaderRef={{ current: null }}
            loading={true}
            hasMore={false}
            error={null}
          />
        ) : (
          <div className="feedback-view-container">
            <div className="feedback-view-wrapper">
              <FeedbackView
                activeTab="coupdecoeur"
                viewMode="flat"
                currentState={{
                  data: coupDeCoeursForDisplay,
                  loading: isLoading,
                  hasMore: false,
                  error: null,
                }}
                openId={null}
                setOpenId={() => {}}
                groupOpen={{}}
                setGroupOpen={() => {}}
                selectedBrand={selectedBrand}
                selectedCategory={selectedCategory}
                renderCard={() => <></>}
              />
            </div>
            <aside className="right-panel">
              <FilterIllustration
                filter={activeFilter}
                selectedBrand={selectedBrand}
                selectedCategory={selectedCategory}
              />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CdcTab;

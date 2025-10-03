import React from "react";
import HomeFiltersSuggestion from "../HomeFiltersSuggestion";
import FeedbackView from "@src/components/feedbacks/FeedbackView";
import FilterIllustration from "../home-illustration/FilterIllustration";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import { getBrandLogo } from "@src/utils/brandLogos";
import Avatar from "@src/components/shared/Avatar";

interface Props {
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  selectedBrand: string;
  handleSuggestionBrandChange: (b: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  suggestionCategories: string[];
  suggestionSearch: string;
  setSuggestionSearch: (s: string) => void;
  suggestionBannerStyle: React.CSSProperties;
  brandBannerStyle: React.CSSProperties;
  suggestionsForDisplay: any[];
  displayedCount: number;
  selectedBrandLogo: string | null;
  selectedSiteUrl?: string;
  totalCount: number;
  filteredByCategory: any[];
  isLoading: boolean;
}

const SuggestionTab: React.FC<Props> = ({
  activeFilter,
  setActiveFilter,
  selectedBrand,
  handleSuggestionBrandChange,
  selectedCategory,
  setSelectedCategory,
  suggestionCategories,
  suggestionSearch,
  setSuggestionSearch,
  suggestionBannerStyle,
  suggestionsForDisplay,
  selectedSiteUrl,
  totalCount,
  filteredByCategory,
  isLoading,
}) => {
  return (
    <div
      className={`suggestion-banner-container ${selectedBrand ? "banner-filtered" : `banner-${activeFilter}`}`}
      style={selectedBrand ? suggestionBannerStyle : undefined}
    >
      <div className="feedback-list-wrapper">
        <HomeFiltersSuggestion
          filter={activeFilter}
          setFilter={setActiveFilter}
          selectedBrand={selectedBrand}
          setSelectedBrand={handleSuggestionBrandChange}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availableCategories={suggestionCategories}
          searchQuery={suggestionSearch}
          onSearchChange={setSuggestionSearch}
        />

        {isLoading ? (
          <SqueletonAnime
            loaderRef={{ current: null }}
            loading={true}
            hasMore={false}
            error={null}
          />
        ) : (
          <div>
            <div className="selected-brand-heading">
              {selectedBrand && (
                <div className="selected-brand-summary">
                  <div className="selected-brand-summary__brand">
                    <div className="selected-brand-summary__logo">
                      <Avatar
                        avatar={getBrandLogo(selectedBrand, selectedSiteUrl)}
                        pseudo={selectedBrand}
                        type="brand"
                      />
                    </div>
                    <div className="selected-brand-summary__info-container">
                      {selectedCategory ? (
                        <>
                          <span className="count">
                            {filteredByCategory.length}
                          </span>
                          <span className="text">
                            Signalement
                            {filteredByCategory.length > 1 ? "s" : ""} lié
                            {filteredByCategory.length > 1 ? "s" : ""} à «{" "}
                            <b>{selectedCategory}</b> » sur{" "}
                            {` ${capitalizeFirstLetter(selectedBrand)}`}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="count">{totalCount}</span>
                          <span className="text">
                            Signalement{totalCount > 1 ? "s" : ""} sur{" "}
                            {` ${capitalizeFirstLetter(selectedBrand)}`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <FeedbackView
              activeTab="suggestion"
              viewMode="flat"
              currentState={{
                data: suggestionsForDisplay,
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
        )}
      </div>

      <aside className="right-panel">
        <FilterIllustration
          filter={activeFilter}
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          onglet="suggestion"
        />
      </aside>
    </div>
  );
};

export default SuggestionTab;

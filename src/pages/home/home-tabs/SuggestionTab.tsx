import React from "react";
import HomeFiltersSuggestion from "../HomeFiltersSuggestion";
import FeedbackView from "@src/components/feedbacks/FeedbackView";
import FilterIllustration from "../home-illustration/FilterIllustration";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";

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
  brandBannerStyle,
  suggestionsForDisplay,
  displayedCount,
  selectedBrandLogo,
  isLoading,
}) => {
  return (
    <div
      className={`suggestion-banner-container ${selectedBrand ? "banner-filtered" : `banner-${activeFilter}`}`}
      style={
        selectedBrand
          ? { ...suggestionBannerStyle, ...brandBannerStyle }
          : suggestionBannerStyle
      }
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
              {selectedBrand && selectedBrandLogo && (
                <img
                  src={selectedBrandLogo}
                  alt={`${selectedBrand} logo`}
                  className="selected-brand-heading__logo"
                />
              )}
              {selectedBrand && (
                <h1>
                  <div className="selected-brand-count">{displayedCount}</div>
                  signalement{displayedCount > 1 ? "s" : ""}{" "}
                  {selectedCategory &&
                    `lié${displayedCount > 1 ? "s" : ""} au ${selectedCategory}`}{" "}
                  sur {capitalizeFirstLetter(selectedBrand)}
                </h1>
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
        />
      </aside>
    </div>
  );
};

export default SuggestionTab;

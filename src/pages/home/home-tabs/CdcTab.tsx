import React from "react";
import HomeFiltersCdc from "../HomeFiltersCdc";
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
  setSelectedBrand: (b: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  brandBannerStyle: React.CSSProperties;
  coupDeCoeurCategories: string[];
  coupDeCoeursForDisplay: any[];
  filteredByCategory: any[];
  totalCount: number;
  selectedSiteUrl?: string;
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
  filteredByCategory,
  totalCount,
  selectedSiteUrl,
  isLoading,
}) => {
  return (
    <div
      className={`cdc-banner-container ${selectedBrand ? "banner-filtered" : `banner-${activeFilter}`}`}
      style={brandBannerStyle}
    >
      <div className="feedback-list-wrapper">
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
              <HomeFiltersCdc
                filter={activeFilter}
                setFilter={setActiveFilter}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                availableCategories={coupDeCoeurCategories}
              />
              <div>
                <div className="selected-brand-heading">
                  {selectedBrand && (
                    <div className="selected-brand-summary">
                      <div className="selected-brand-summary__brand">
                        <div className="selected-brand-summary__logo">
                          <Avatar
                            avatar={getBrandLogo(
                              selectedBrand,
                              selectedSiteUrl,
                            )}
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
            </div>
            <aside className="right-panel">
              <FilterIllustration
                filter={activeFilter}
                selectedBrand={selectedBrand}
                selectedCategory={selectedCategory}
                onglet="coupdecoeur"
              />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CdcTab;

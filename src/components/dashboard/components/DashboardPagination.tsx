type DashboardPaginationProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

const DashboardPagination = ({
  page,
  totalPages,
  onPrev,
  onNext,
}: DashboardPaginationProps) => (
  <div className="feed-table-body-page">
    <div className="feed-table-body-page-button" onClick={onPrev}>
      <h3>Page précédente</h3>
    </div>

    <div className="feed-table-body-page-location">
      Page {page}/{totalPages}
    </div>

    <div className="feed-table-body-page-button" onClick={onNext}>
      <h3>Page suivante</h3>
    </div>
  </div>
);

export default DashboardPagination;

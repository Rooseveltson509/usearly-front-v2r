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
      <p>Page précédente</p>
    </div>

    <div className="feed-table-body-page-location">
      Page {page}/{totalPages}
    </div>

    <div className="feed-table-body-page-button" onClick={onNext}>
      <p>Page suivante</p>
    </div>
  </div>
);

export default DashboardPagination;

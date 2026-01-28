import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TooltipProvider } from "@src/components/ui/tooltip";
import DataTable from "@src/components/dashboard/components/DataTable";
import { createDashboardUserColumns } from "@src/pages/admin/dashboardUser/config/table";
import { type UserRow } from "@src/types/Filters";
import "./feed.scss";

const Feed = ({ users }: { users: UserRow[] }) => {
  const navigate = useNavigate();
  const columns = useMemo(
    () =>
      createDashboardUserColumns((userId) =>
        navigate(`/admin/users/${userId}`),
      ),
    [navigate],
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="feed-table-container">
        <DataTable
          columns={columns}
          rows={users}
          getRowKey={(user, index) => `${user.id}-${index}`}
          tableClassName="feed-table"
          headClassName="feed-table-head"
          headRowClassName="feed-table-head-title"
          bodyClassName="feed-table-body"
          rowClassName="feed-table-body-line"
          emptyState={{
            message: "Aucun utilisateur",
            colSpan: 11,
            rowClassName: "feed-table-body-line feed-table-body-line--empty",
            cellClassName: "feed-table-body-line-data",
            containerClassName: "feed-table-body-line-data",
            messageClassName: "feed-table-body-line-data-empty",
          }}
        />
      </div>
    </TooltipProvider>
  );
};

export default Feed;

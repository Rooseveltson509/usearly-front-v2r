import { type Key, type ReactNode } from "react";

export type DataTableColumn<Row> = {
  key: string;
  header: ReactNode;
  thClassName?: string;
  tdClassName?: string;
  render: (row: Row, rowIndex: number) => ReactNode;
};

type EmptyState = {
  message: string;
  colSpan: number;
  rowClassName: string;
  cellClassName: string;
  containerClassName?: string;
  messageClassName: string;
};

type DataTableProps<Row> = {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  getRowKey?: (row: Row, index: number) => Key;
  tableClassName: string;
  headClassName: string;
  headRowClassName: string;
  bodyClassName: string;
  rowClassName: string;
  emptyState?: EmptyState;
};

const DataTable = <Row,>({
  columns,
  rows,
  getRowKey,
  tableClassName,
  headClassName,
  headRowClassName,
  bodyClassName,
  rowClassName,
  emptyState,
}: DataTableProps<Row>) => (
  <table className={tableClassName}>
    <thead className={headClassName}>
      <tr className={headRowClassName}>
        {columns.map((column) => (
          <th key={column.key} className={column.thClassName}>
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className={bodyClassName}>
      {rows.map((row, index) => (
        <tr
          key={getRowKey ? getRowKey(row, index) : index}
          className={rowClassName}
        >
          {columns.map((column) => (
            <td key={column.key} className={column.tdClassName}>
              {column.render(row, index)}
            </td>
          ))}
        </tr>
      ))}
      {rows.length === 0 && emptyState && (
        <tr className={emptyState.rowClassName}>
          <td colSpan={emptyState.colSpan} className={emptyState.cellClassName}>
            <div
              className={
                emptyState.containerClassName ?? emptyState.cellClassName
              }
            >
              <span className={emptyState.messageClassName}>
                {emptyState.message}
              </span>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default DataTable;

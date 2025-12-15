import "./Toast.scss";

const Toast = ({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) => {
  return <div className={`toast toast-${type}`}>{message}</div>;
};

export default Toast;

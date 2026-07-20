import { ORDER_STATUS } from "../../constants/orders";

const OrderStatusBadge = ({ status }) => {
  let styleClasses;

  switch (status) {
    case ORDER_STATUS.PLACED:
      styleClasses = "bg-blue-950/40 text-blue-400 border-blue-800/30";
      break;
    case ORDER_STATUS.PROCESSING:
      styleClasses = "bg-purple-950/40 text-purple-400 border-purple-800/30";
      break;
    case ORDER_STATUS.READY:
      styleClasses = "bg-amber-950/40 text-amber-400 border-amber-800/30";
      break;
    case ORDER_STATUS.COMPLETED:
      styleClasses = "bg-emerald-950/40 text-emerald-400 border-emerald-800/30";
      break;
    case ORDER_STATUS.CANCELLED:
      styleClasses = "bg-rose-950/40 text-rose-400 border-rose-800/30";
      break;
    default:
      styleClasses = "bg-zinc-900/40 text-zinc-400 border-zinc-800/30";
  }

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xxs font-bold uppercase tracking-wider border ${styleClasses}`}>
      {status}
    </span>
  );
};

export default OrderStatusBadge;

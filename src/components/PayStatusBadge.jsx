// import { useState } from "react";

const PAYSTATUS = {
  paid: '已付款',
  failed: '付款失敗',
  pending: '即將付款',
};

function PayStatusBadge({ currentStatus, isArchived }) {
  // const [payStatus, setPayStatus] = useState(currentStatus)

  // 定義切換方法
  // const handlePayStatus = () => {
  //   setPayStatus((prev)=>{
  //     switch(prev) {
  //       case PAYSTATUS.DEFAULT:
  //         return PAYSTATUS.PAID;
  //       // case PAYSTATUS.PAID:
  //         // return PAYSTATUS.FAILED;
  //       // case PAYSTATUS.FAILED:
  //       case PAYSTATUS.PAID:
  //       default:
  //         return PAYSTATUS.DEFAULT;
  //     }
  //   })
  // }
  // const getPayLabel = () => {
  //   switch(payStatus) {
  //     case PAYSTATUS.DEFAULT:
  //     default:
  //       return "未付款";
  //     case PAYSTATUS.PAID:
  //       return "已付款";
  //     case PAYSTATUS.FAILED:
  //       return "付款失敗";
  //   }
  // }
  const getNewStatus = () => {
    switch (currentStatus) {
      case 1:
        return 3;
      // case 2:
      //   return 3
      case 3:
      default:
        return 1;
    }
  };
  const isFailed = currentStatus === 'failed';
  // payStatus === PayStatusOptions.DEFAULT;
  // const isPaid = payStatus === PayStatusOptions.PAID;
  // const isFailed = payStatus === PayStatusOptions.FAILED;
  // onClick={()=>{(!isFailed)&&(!isArchived)&&onChange(getNewStatus())}}
  return (
    <button type="button" className={`payStatusBadge ${isFailed ? 'failed' : ''}`}>
      {PAYSTATUS[currentStatus]}
    </button>
  );
}

export default PayStatusBadge;

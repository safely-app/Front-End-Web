import { toast } from 'react-toastify';
import { getErrorMsgByStatusCode, getErrorMsgByErrorName } from './errorMessages';

export const notifyError = (error: any) => {
  let errorMessage: string = error;

  if (error.response)
    errorMessage = getErrorMsgByStatusCode(error.response);
  else if (error.message)
    errorMessage = getErrorMsgByErrorName(error);

  return toast.error(errorMessage, {
    position: "top-right",
    autoClose: Math.ceil(errorMessage.length / 50) * 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  });
}

export const notifySuccess = (msg: string) => {
  return toast.success(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  });
}

export const notifyInfo = (msg: string) => {
  return toast.info(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  });
};

export const convertStringToRegex = (value: string): RegExp =>
  new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

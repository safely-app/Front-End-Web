import { toast } from 'react-toastify';
import { getErrorMsgByStatusCode } from './errorMessages';

export const notifyError = (error: any) => {
    let errorMessage: string = error;

    if (error.response)
        errorMessage = getErrorMsgByStatusCode(error.response);
    else if (error.message)
        errorMessage = error.message;

    return toast.error(errorMessage, {
        position: "top-right",
        autoClose: Math.ceil(errorMessage.length / 50) * 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    });
}

export const notifySuccess = (msg: string) => toast.success(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
});

export const convertStringToRegex = (value: string): RegExp =>
    new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

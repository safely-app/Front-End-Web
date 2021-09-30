import { toast } from 'react-toastify';

export const notifyError = (msg: string) => toast.error(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
});

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

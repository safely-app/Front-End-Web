import { toast } from 'react-toastify';

export const isEmailValid = (email: string): boolean => {
    return email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g) != null;
};

export const isPasswordValid = (password: string): boolean => {
    return !!password && password.length >= 3;
};

export const notifyError = (msg: string) => toast.error(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
});

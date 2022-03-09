import { AxiosResponse } from "axios";

const basicErrorMessage = "Une erreur s'est produite. Si cela persiste, veuillez nous contacter.";

const errorMessages = {
    401: "Veuillez vous authentifier avant de continuer.",
    403: "Accès non-autorisé : veuillez vérifiez que vous avez accès à cette ressource.",
    404: "Ressource introuvable."
};

export const getErrorMsgByStatusCode = (response: AxiosResponse): string => {
    if (Object.keys(errorMessages).includes(response.status.toString()))
        return errorMessages[response.status];
    return `${response.status} ${response.statusText} : ${basicErrorMessage}`;
};
import React, { useState } from 'react';
import { useAppSelector } from '../../redux';
import IReport from '../../components/interfaces/IReport';
import { AppHeader } from "../Header/Header";
import { BugReportManager } from '../../services';
import { notifyError, notifySuccess } from '../utils';
import log from "loglevel";

const BugReport: React.FC = () => {
  const userCredientials = useAppSelector(state => state.user.credentials);
  const [report, setReport] = useState<IReport>({
    id: '',
    userId: '',
    title: '',
    comment: '',
    type: 'Bug'
  });

  const setField = (field: string, event: React.ChangeEvent<any>) => {
    setReport({
      ...report,
      [field]: event.target.value
    });
  };

  const sendReport = async () => {
    if (report.comment.length > 1000) {
      notifyError("Votre commentaire ne peut pas dépasser les 1000 charactères.");
      return;
    }

    try {
      // Type must be one of [Bug, Opinion]
      const newReport = {
        ...report,
        type: (report.type === 'Feature') ? 'Bug' : report.type
      };

      await BugReportManager.send(userCredientials._id, newReport, userCredientials.token);
      notifySuccess("Votre rapport a été envoyé. Merci à vous !");
      setReport({
        id: '',
        userId: '',
        title: '',
        comment: '',
        type: 'Bug'
      });
    } catch (error) {
      notifyError("Votre rapport n'a pas pu être envoyé.");
      log.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-transparent space-y-2 bg-cover bg-center">
      <AppHeader />

      <section className="bg-white dark:bg-gray-900">
  <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Contactez-nous</h2>
      <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">Avez-vous un problème technique ? Souhaitez vous nous faire part de vos commentaires sur une fonctionnalité ? Avez-vous besoin de détails sur nos abonnements ? Faites-le nous savoir.</p>
      <form action="#" className="space-y-8">
          <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">J'aimerais</label>
              <select className="w-full border border-gray-200 p-2 focus:outline-none focus:border-gray-500" value={report.type} onChange={(event) => setField('type', event)}>
              <option value="Bug">Rapporter un bug</option>
              <option value="Feature">Requête d'une fonctionalité</option>
              <option value="Opinion">Commentaire</option>
            </select>
          </div>
          <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Titre</label>
              <input  value={report.title} onChange={(event) => setField('title', event)} type="text" id="subject" className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Titre de votre requête" required/>
          </div>
          <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Description</label>
              <textarea  value={report.comment} onChange={(event) => setField('comment', event)} id="message" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Décrivez-nous votre avis"></textarea>
          </div>
          <div className="flex justify-center submit">
          <button className="text-lg font-bold text-white bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg float-right" onClick={sendReport}>
              Envoyer
            </button>
          </div>
      </form>
  </div>
</section>
      
      
    </div>
  );
}

export default BugReport;
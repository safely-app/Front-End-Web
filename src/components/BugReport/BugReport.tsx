import React, { useState } from 'react';
import { useAppSelector } from '../../redux';
import IReport from '../../components/interfaces/IReport';
import { AppHeader } from "../Header/Header";
import { Button } from '../common';
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
      <div className="antialiased text-gray-900 bg-transparent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">

        <div className="mx-4 card bg-white max-w-md p-10 md:rounded-lg my-8 mx-auto">
          <div className="title">
            <h1 className="font-bold text-center">Rapporter un bug ou faire une requête d'une fonctionalité</h1>
          </div>

          <div className="options md:flex md:space-x-6 text-sm items-center text-gray-700 mt-4">
            <p className="w-1/2 mb-2 md:mb-0">J'aimerais</p>
            <select className="w-full border border-gray-200 p-2 focus:outline-none focus:border-gray-500" value={report.type} onChange={(event) => setField('type', event)}>
              <option value="Bug">Rapporter un bug</option>
              <option value="Feature">Requête d'une fonctionalité</option>
              <option value="Opinion">Commentaire</option>
            </select>
          </div>

          <div className="form mt-4">
            <div className="flex flex-col text-sm">
              <label className="font-bold mb-2">Titre</label>
              <input className=" appearance-none w-full border border-gray-200 p-2 h-10 focus:outline-none focus:border-gray-500" type="text" placeholder="Titre" value={report.title} onChange={(event) => setField('title', event)} />
            </div>

            <div className="text-sm flex flex-col">
              <label className="font-bold mt-4 mb-2">Description</label>
              <textarea className=" appearance-none w-full border border-gray-200 p-2 h-40 focus:outline-none focus:border-gray-500" placeholder="Votre commentaire..." value={report.comment} onChange={(event) => setField('comment', event)}></textarea>
            </div>
          </div>

          <div className="submit">
            <Button className=" w-full bg-blue-600 shadow-lg text-white px-4 py-2 hover:bg-blue-700 mt-8 text-center font-semibold focus:outline-none" text="Envoyer" onClick={sendReport} />
          </div>
        </div>

      </div>

    </div>
  );
}

export default BugReport;
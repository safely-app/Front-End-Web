import React, { useState } from 'react';
import { useAppSelector } from '../../redux';
import IReport from '../../components/interfaces/IReport';
import { AppHeader } from "../Header/Header";
import { TextInput, Button } from '../common';
import { BugReportManager } from '../../services';

const BugReport: React.FC = () => {
    const userCredientials = useAppSelector(state => state.user.credentials);
    const [report, setReport] = useState<IReport>({
        userId: '',
        title: '',
        comment: '',
        type: ''
    });

    const setTitle = (value: string) => {
        setReport({
            ...report,
            title: value
        });
    };

    const setComment = (value: string) => {
        setReport({
            ...report,
            comment: value
        });
    };
    
    const sendReport = () => {
        BugReportManager.send(userCredientials._id, report, userCredientials.token)
    };

    return (
        <div className="min-h-screen bg-background bg-transparent space-y-2 bg-cover bg-center">
            <AppHeader />
            <body className="antialiased text-gray-900 bg-transparent">

    
    <div className="mx-4 card bg-white max-w-md p-10 md:rounded-lg my-8 mx-auto">
        <div className="title">
            <h1 className="font-bold text-center">Rapporter un bug ou faire une requête d'une fonctionalité</h1>
        </div>

        <div className="options md:flex md:space-x-6 text-sm items-center text-gray-700 mt-4">
            <p className="w-1/2 mb-2 md:mb-0">J'aimerai</p>
            <select className="w-full border border-gray-200 p-2 focus:outline-none focus:border-gray-500">
                <option value="bug">Rapporter un bug</option>
                <option value="feature">Requête d'une fonctionalité</option>
                <option value="feedback">Commentaire</option>
            </select>
        </div>    

            <div className="form mt-4">
                <div className="flex flex-col text-sm">
                    <label className="font-bold mb-2">Titre</label>
                    <TextInput className=" appearance-none w-full border border-gray-200 p-2 h-10 focus:outline-none focus:border-gray-500" type="text" role="email" label="Titre" value={report.title} setValue={setTitle} />
                </div>

               <div className="text-sm flex flex-col">
                <label className="font-bold mt-4 mb-2">Description</label>
                   <TextInput className=" appearance-none w-full border border-gray-200 p-2 h-40 focus:outline-none focus:border-gray-500" type="text" role="email" label="Votre commentaire..." value={report.comment} setValue={setComment} />
               </div>
            </div>

            <div className="submit">
                <Button className=" w-full bg-blue-600 shadow-lg text-white px-4 py-2 hover:bg-blue-700 mt-8 text-center font-semibold focus:outline-none" text="Envoyer" onClick={sendReport} />
            </div>
    </div>
    

</body>
            
        </div>
    );
}

export default BugReport;
import React, {  } from 'react';
import { AppHeader } from "../Header/Header";

const BugReport: React.FC = () => {
    const report = "";



    return (
        <div className="container">
            <AppHeader />
            <body className="antialiased text-gray-900 bg-blue-600">

    
    <div className="mx-4 card bg-white max-w-md p-10 md:rounded-lg my-8 mx-auto">
        <div className="title">
            <h1 className="font-bold text-center">Rapporter un bug ou faire une requête d'une fonctionalité</h1>
        </div>

        <div className="options md:flex md:space-x-6 text-sm items-center text-gray-700 mt-4">
            <p className="w-1/2 mb-2 md:mb-0">J'aimerai</p>
            <select className="w-full border border-gray-200 p-2 focus:outline-none focus:border-gray-500">
                <option value="select">Selctionner une option</option>
                <option value="bug">Rapporter un bug</option>
                <option value="feature">Requête d'une fonctionalité</option>
                <option value="feedback">Commentaire</option>
            </select>
        </div>    

            <div className="form mt-4">
                <div className="flex flex-col text-sm">
                    <label className="font-bold mb-2">Titre</label>
                    <input className=" appearance-none border border-gray-200 p-2 focus:outline-none focus:border-gray-500" type="text" placeholder="Enter a title"> </input>
                </div>

               <div className="text-sm flex flex-col">
                <label className="font-bold mt-4 mb-2">Description</label>
                   <textarea className=" appearance-none w-full border border-gray-200 p-2 h-40 focus:outline-none focus:border-gray-500" id={report}  placeholder="Enter your description"></textarea>
               </div>
            </div>

            <div className="submit">
                <button type="submit" className=" w-full bg-blue-600 shadow-lg text-white px-4 py-2 hover:bg-blue-700 mt-8 text-center font-semibold focus:outline-none ">Envoyer</button>
            </div>
    </div>
    

</body>
            
        </div>
    );
}

export default BugReport;
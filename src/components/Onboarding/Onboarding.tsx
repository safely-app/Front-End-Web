import { useState } from 'react';
import {
  useAppSelector,
  useAppDispatch,
  setProfessionalInfo
} from '../../redux';
import { BsFillCircleFill } from 'react-icons/bs';
import imgOnboarding from '../../assets/image/mec_allongé.png';
import IProfessional from '../interfaces/IProfessional';
import { notifyError } from '../utils';
import log from "loglevel";
import { ProfessionalInfo } from '../../services';

const OnboardingPageOne: React.FC = () => {
  return (
    <div className='w-fit float-left'>
      <p className='text-xl font-bold py-6'>Avant de commencer...</p>
      <p className='text-lg w-96'>
        C'est votre première connexion au sein de votre espace commerçant ? Ne paniquez pas !
        Suivez ce guide étape par étape pour comprendre les fonctionnalités que vous propose notre application web !
      </p>
    </div>
  );
};

let createdProfessional = false;
let createdProfessionalInfo;

const OnboardingPageTwo: React.FC<{
  professional: IProfessional;
  setProfessional: (professional: IProfessional) => void;
}> = ({
  professional,
  setProfessional,
}) => {
  const setField = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setProfessional({
      ...professional,
      [field]: event.target.value
    });
  };

  return (
    <div className='w-fit float-left mb-8'>
      <p className='text-xl font-bold py-6'>Informations commerçantes</p>
      <p className='text-lg w-96'>
        Veuillez renseigner ci-dessous les informations de votre commerce.
      </p>
      <div>
        <div className='grid grid-cols-2 grid-rows-2 gap-3 mt-4'>
          <input className="rounded border-2 border-neutral-300 p-1 text-sm" placeholder="Nom de l'entreprise" value={professional.companyName} onChange={(event) => setField("companyName", event)} />
          <input className="rounded border-2 border-neutral-300 p-1 text-sm" placeholder="Numéro de client TVA" value={professional.clientNumberTVA} onChange={(event) => setField("clientNumberTVA", event)} />
          <input className="rounded border-2 border-neutral-300 p-1 text-sm" placeholder="Téléphone personnel" value={professional.personalPhone} onChange={(event) => setField("personalPhone", event)} />
          <input className="rounded border-2 border-neutral-300 p-1 text-sm" placeholder="Téléphone d'entreprise" value={professional.companyPhone} onChange={(event) => setField("companyPhone", event)} />
        </div>
        <div className='mt-8'>
          <input className="block my-3 rounded border-2 border-neutral-300 p-1 text-sm w-full" placeholder="Adresse d'entreprise" value={professional.companyAddress} onChange={(event) => setField("companyAddress", event)} />
          <input className="block my-3 rounded border-2 border-neutral-300 p-1 text-sm w-full" placeholder="Adresse d'entreprise 2 (facultatif)" value={professional.companyAddress2} onChange={(event) => setField("companyAddress2", event)} />
          <input className="block my-3 rounded border-2 border-neutral-300 p-1 text-sm w-full" placeholder="Adresse de facturation" value={professional.billingAddress} onChange={(event) => setField("billingAddress", event)} />
          <input className="block my-3 rounded border-2 border-neutral-300 p-1 text-sm w-full" placeholder="Type d'entreprise" value={professional.type} onChange={(event) => setField("type", event)} />
        </div>
      </div>
    </div>
  );
};

const OnboardingPageThree: React.FC = () => {
  return (
    <div className='w-fit float-left'>
      <p className='text-xl font-bold py-6'>Comment ça marche ?</p>
      <div className='text-lg w-96'>
        Au sein de votre dashboard, vous avez accès à plusieurs fonctionnalités dont:
        <ul className='list-disc ml-6 mt-4'>
          <li>Suivi de l'état de votre commerce sur Safely</li>
          <li>Création de campagnes publicitaires</li>
          <li>Suivi en temps réel à l'aide de graphiques de vos campagnes publicitaires</li>
        </ul>
      </div>
    </div>
  );
};

const OnboardingPageFour: React.FC = () => {
  return (
    <div className='w-fit float-left'>
      <p className='text-xl font-bold py-6'>Votre campagne publicitaire</p>
      <div className='text-lg w-96'>
        <span>
          Vous souhaitez vous lancer et créer une campagne publicitaire sur Safely ? Ça n'a jamais été aussi facile, il suffit de définir :
        </span>
        <ul className='list-disc ml-6 mt-4'>
          <li>Un nom de campagne</li>
          <li>Un budget maximum</li>
          <li>Une date de départ</li>
          <li>Vos cibles publicitaires</li>
        </ul>
        <span className='block mt-4'>
          Et voila ! Après avoir défini ces critères, votre campagne publicitaire sera officiellement lancée !
        </span>
      </div>
    </div>
  );
};

const OnboardingPageFifth: React.FC = () => {
  return (
    <div className='w-fit float-left'>
      <p className='text-xl font-bold py-6'>Suivi en temps réel</p>
      <p className='text-lg w-96'>
        Vous aimez les statistiques ? Nous aussi ! Safely vous propose plusieurs outils pour suivre en temps réel l’efficacité de votre campagne publicitaire. Prenez également un peu de temps pour regarder sur la carte les autres commerces à Strasbourg.
      </p>
    </div>
  );
};


const Onboarding: React.FC = () => {
  const dispatch = useAppDispatch();
  const userCredentials = useAppSelector(state => state.user.credentials);

  const [step, setStep] = useState(0);
  const [professional, setProfessional] = useState<IProfessional>({
    id: "",
    type: "",
    userId: userCredentials._id,
    companyName: "",
    companyPhone: "",
    personalPhone: "",
    billingAddress: "",
    companyAddress: "",
    companyAddress2: "",
    clientNumberTVA: "",
  });

  const ArrowButton: React.FC = () => {
    return (
      <button type='button' className='rotate-180 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800' onClick={removeStep}>
        <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </button>
    );
  };

  const addStep = () => (step + 1 <= 4) && setStep(step + 1);
  const removeStep = () => (step - 1 >= 0) && setStep(step - 1);

  const leavePage = () => window.location.href = "/";


  const createProfessional = async () => {
    try {
      if (createdProfessional === false) {
        createdProfessionalInfo = await ProfessionalInfo.create(professional);
        createdProfessionalInfo.data.id = createdProfessionalInfo.data._id;
        delete createdProfessionalInfo.data._id;
        delete createdProfessionalInfo.data.createdAt;
        delete createdProfessionalInfo.data.updatedAt;
        delete createdProfessionalInfo.data.__v;
        dispatch(setProfessionalInfo(professional));
        createdProfessional = true;
        addStep();
      } else {
        await ProfessionalInfo.update(createdProfessionalInfo.data.id, createdProfessionalInfo.data, userCredentials.token);
        addStep();
      }
    } catch (error) {
      notifyError(error);
      log.error(error);
    }
  };

  const steps = [
    { buttonText: "Suivant", onClick: addStep, render: <OnboardingPageOne /> },
    { buttonText: "Suivant", onClick: createProfessional, render: <OnboardingPageTwo professional={professional} setProfessional={setProfessional} /> },
    { buttonText: "Suivant", onClick: addStep, render: <OnboardingPageThree /> },
    { buttonText: "Suivant", onClick: addStep, render: <OnboardingPageFour /> },
    { buttonText: "Terminer", onClick: leavePage, render: <OnboardingPageFifth /> },
  ];

  return (
    <div className="relative w-full h-full">
      <div className='absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='grid grid-cols-2 gap-8'>
          <div className='my-auto'>
            <div className='w-fit float-right'>
              <img className='block object-center h-80' src={imgOnboarding} alt="" />
              <ul className='h-12 w-fit mx-auto text-xs space-x-3'>
                <li className={'float-left ' + (step >= 0 ? 'text-blue-500' : 'text-neutral-300')}><BsFillCircleFill /></li>
                <li className={'float-left ' + (step >= 1 ? 'text-blue-500' : 'text-neutral-300')}><BsFillCircleFill /></li>
                <li className={'float-left ' + (step >= 2 ? 'text-blue-500' : 'text-neutral-300')}><BsFillCircleFill /></li>
                <li className={'float-left ' + (step >= 3 ? 'text-blue-500' : 'text-neutral-300')}><BsFillCircleFill /></li>
                <li className={'float-left ' + (step >= 4 ? 'text-blue-500' : 'text-neutral-300')}><BsFillCircleFill /></li>
              </ul>
            </div>
          </div>
          <div className='my-auto'>
            {steps[step].render}
          </div>
        </div>
      </div>
      <div className='absolute top-3/4 left-1/2 -translate-x-1/2'>
        <div className='space-x-6 text-center'>
        </div>
        <div className='space-x-6 text-center'>
        { step > 0 ? <ArrowButton /> : null }
          <button
            className='bg-blue-500 hover:bg-blue-400 text-white rounded-md p-2 w-40 font-bold'
            onClick={() => steps[step].onClick()}
          >
            {steps[step].buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
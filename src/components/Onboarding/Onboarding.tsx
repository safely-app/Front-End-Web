import { useState } from 'react';
import { BsFillCircleFill } from 'react-icons/bs';
import imgOnboarding from '../../assets/image/mec_allongé.png';
import IProfessional from '../interfaces/IProfessional';
import { notifyError } from '../utils';
import log from "loglevel";
import { ProfessionalInfo } from '../../services';
import { useAppSelector } from '../../redux';

const OnboardingPageOne: React.FC = () => {
  return (
    <div className='w-fit float-left'>
      <p className='text-xl font-bold py-6'>Avant de commencer...</p>
      <p className='text-lg w-96'>
        C'est votre première connexion au sein de votre espace commerçant ? Ne paniquez pas !
        Suivez ce guide step-by-step pour comprendre les fonctionnalités que vous propsent notre application web !
      </p>
    </div>
  );
};

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
          <li>Suivi en temps réel à l'aide de graphes de vos campagnes</li>
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
          Vous souhaitez vous lancer et creér une campagne publicitaire sur Safely ? Ça n'a jamais été aussi facile, il suffit de définir :
        </span>
        <ul className='list-disc ml-6 mt-4'>
          <li>Un nom de campagne</li>
          <li>Un budget</li>
          <li>Une date de départ</li>
          <li>Des cibles</li>
        </ul>
        <span className='block mt-4'>
          Et voila ! Après avoir défini ces critères, votre campagne publicitaire sera officiellement déployé.
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

  const addStep = () => (step + 1 <= 4) && setStep(step + 1);

  const leavePage = () => window.location.href = "/";

  const createProfessional = async () => {
    try {
      await ProfessionalInfo.create(professional);
      addStep();
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
import { useState, useMemo } from "react";
import ICampaign from "../../interfaces/ICampaign";
import {
  CommercialCampaignCreationStepOne,
  CommercialCampaignCreationStepTwo,
  CommercialCampaignCreationStepThree,
  CommercialCampaignCreationStepFour,
  CommercialCampaignCreationStepFive
} from './CreationSteps';
import './../Commercial.css';

const CommercialCampaignCreation: React.FC = () => {
  const maxStep = useMemo(() => 4, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [newCampaign, setNewCampaign] = useState<ICampaign>({
    id: "",
    ownerId: "",
    name: "",
    budget: "",
    status: "",
    safeplaceId: "",
    startingDate: "",
    targets: [],
  });

  const subCurrentStep = () => {
    if (currentStep - 1 >= 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  const addCurrentStep = () => {
    if (currentStep + 1 <= maxStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getCurrentView = () => {
    switch (currentStep) {
      case 4:
        return <CommercialCampaignCreationStepFive
          prevStepClick={subCurrentStep}
          nextStepClick={addCurrentStep}
        />;
      case 3:
        return <CommercialCampaignCreationStepFour
          prevStepClick={subCurrentStep}
          nextStepClick={addCurrentStep}
        />;
      case 2:
        return <CommercialCampaignCreationStepThree
          prevStepClick={subCurrentStep}
          nextStepClick={addCurrentStep}
        />;
      case 1:
        return <CommercialCampaignCreationStepTwo
          prevStepClick={subCurrentStep}
          nextStepClick={addCurrentStep}
        />;
      case 0:
      default:
        return <CommercialCampaignCreationStepOne
          onClick={addCurrentStep}
        />;
    }
  };

  return (
    <div className="flex-auto space-y-4 flex flex-col">
      <div className="flex-none bg-white rounded-lg shadow-xl border border-solid border-neutral-100">
        <p className="px-6 py-8 font-bold text-xl">Nouvelle campagne</p>
      </div>
      {getCurrentView()}
    </div>
  );
};

export default CommercialCampaignCreation;
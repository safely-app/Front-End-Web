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
import { useAppSelector } from "../../../redux";
import { Commercial } from "../../../services";
import log from "loglevel";

const CommercialCampaignCreation: React.FC = () => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const maxStep = useMemo(() => 4, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [newCampaign, setNewCampaign] = useState<ICampaign>({
    id: "",
    ownerId: userCredentials._id,
    name: "",
    budget: "25",
    status: "active",
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

  const createOrUpdateCampaign = async () => {
    try {
      const campaign = {
        ...newCampaign,
        startingDate: (new Date()).toDateString()
      };

      if (newCampaign.id === "") {
        const result = await Commercial.createCampaign(
          campaign,
          userCredentials.token
        );

        setNewCampaign({ ...campaign, id: result.data._id });
      } else {
        await Commercial.updateCampaign(
          newCampaign.id,
          campaign,
          userCredentials.token
        );
      }
    } catch (err) {
      log.error(err);
    }
  };

  const setCampaignValue = (field: string, value: any) => {
    setNewCampaign(campaign => ({
      ...campaign,
      [field]: value
    }));
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
          targetIds={newCampaign.targets}
        />;
      case 2:
        return <CommercialCampaignCreationStepThree
          setCampaignValue={setCampaignValue}
          targetIds={newCampaign.targets}
          prevStepClick={subCurrentStep}
          nextStepClick={() => {
            createOrUpdateCampaign();
            addCurrentStep();
          }}
        />;
      case 1:
        return <CommercialCampaignCreationStepTwo
          prevStepClick={subCurrentStep}
          nextStepClick={addCurrentStep}
          setCampaignValue={setCampaignValue}
        />;
      case 0:
      default:
        return <CommercialCampaignCreationStepOne
          onClick={addCurrentStep}
          setCampaignValue={setCampaignValue}
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
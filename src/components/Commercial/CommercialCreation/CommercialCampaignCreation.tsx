import React, { useState, useMemo } from "react";
import ICampaign from "../../interfaces/ICampaign";
import {
  CampaignName,
  CampaignBudget,
  CampaignTarget,
  CampaignAdvertisingRadius,
  CampaignAdvertising,
  CampaignFinal,
} from './CreationSteps';
import './../Commercial.css';
import ISafeplace from "../../interfaces/ISafeplace";
import { useAppSelector } from "../../../redux";
import { Commercial } from "../../../services";
import log from "loglevel";

const CommercialCampaignCreation: React.FC<{
  safeplace: ISafeplace;
  campaigns: ICampaign[];
  setCampaigns: (campaigns: ICampaign[]) => void;
  onEnd: () => void;
}> = ({
  safeplace,
  campaigns,
  setCampaigns,
  onEnd
}) => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const maxStep = useMemo(() => 5, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [newCampaign, setNewCampaign] = useState<ICampaign>({
    id: "",
    ownerId: userCredentials._id,
    name: "",
    budget: 25,
    status: "active",
    safeplaceId: safeplace.id,
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

  const createOrUpdateCampaign = async (campaign: ICampaign) => {
    try {
      const createdCampaign = {
        ...campaign,
        startingDate: (new Date()).toDateString()
      };

      if (createdCampaign.id === "") {
        const result = await Commercial.createCampaign(createdCampaign, userCredentials.token);
        const finalCampaign = { ...createdCampaign, id: result.data._id };

        log.log(finalCampaign.id);
        setNewCampaign(finalCampaign);
        setCampaigns([ ...campaigns, finalCampaign ]);
      } else {
        await Commercial.updateCampaign(createdCampaign.id, createdCampaign, userCredentials.token);
        setCampaigns([
          ...campaigns.filter(campaign => campaign.id !== createdCampaign.id),
          createdCampaign
        ]);
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
      case 5:
        return <CampaignFinal
          prevStepClick={subCurrentStep}
          nextStepClick={onEnd}
        />;
      case 4:
        return <CampaignAdvertisingRadius
          prevStepClick={subCurrentStep}
          nextStepClick={addCurrentStep}
          safeplace={safeplace}
          campaignId={newCampaign.id}
        />;
      case 3:
        return <CampaignAdvertising
          prevStepClick={subCurrentStep}
          nextStepClick={addCurrentStep}
          targetIds={newCampaign.targets}
          getCampaignId={() => newCampaign.id}
        />;
      case 2:
        return <CampaignTarget
          targetIds={newCampaign.targets}
          prevStepClick={subCurrentStep}
          nextStepClick={async (targets) => {
            await createOrUpdateCampaign({ ...newCampaign, targets: targets });
            addCurrentStep();
          }}
        />;
      case 1:
        return <CampaignBudget
          prevStepClick={subCurrentStep}
          nextStepClick={addCurrentStep}
          setCampaignValue={setCampaignValue}
          campaignPrice={newCampaign.budget}
        />;
      case 0:
      default:
        return <CampaignName
          onClick={addCurrentStep}
          setCampaignValue={setCampaignValue}
          campaignTitle={newCampaign.name}
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
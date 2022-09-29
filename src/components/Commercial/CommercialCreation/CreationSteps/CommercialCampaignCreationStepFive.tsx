import { GiPartyPopper } from 'react-icons/gi';

const CommercialCampaignCreationStepFive: React.FC<{
  prevStepClick: () => void;
  nextStepClick: () => void;
}> = ({
  prevStepClick,
  nextStepClick,
}) => {
  return (
    <div className="flex-auto bg-white rounded-lg shadow-xl border border-solid border-neutral-100">
      <div className="mx-auto w-1/2 my-12" style={{ minWidth: "38rem" }}>
        <div className="relative">
          <div className="absolute grid grid-cols-5 bg-neutral-200 rounded-lg h-3 w-1/3 left-1/2 -translate-x-1/2">
            <div className="col-span-5 bg-blue-500 rounded-lg"></div>
          </div>
          <p className="text-center font-bold text-3xl pt-6">Bravo !</p>
          <p className="text-center font-bold text-3xl">Votre campagne a été créée</p>
          <div className="my-10">
            <GiPartyPopper className="w-20 h-20 mx-auto text-yellow-500" />
          </div>

          <div>
            <hr className="my-6" />
            <button className="text-lg font-bold text-blue-500 bg-white hover:text-blue-400 px-6 py-2 rounded-lg float-left" onClick={prevStepClick}>
              RETOUR
            </button>
            <button className="text-lg font-bold text-white bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-lg float-right" onClick={nextStepClick}>
              TERMINER
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommercialCampaignCreationStepFive;
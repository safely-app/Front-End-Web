import { useState } from "react";

const CommercialCampaignCreationStepOne: React.FC<{
  onClick: () => void;
  setCampaignValue: (field: string, value: any) => void;
}> = ({
  onClick,
  setCampaignValue,
}) => {
  const [title, setTitle] = useState("");
  const [isInitState, setIsInitState] = useState(true);

  const handleClick = () => {
    if (title === "")
      return;

    setCampaignValue("title", title);
    onClick();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (isInitState) {
      setIsInitState(false);
    }
  };

  return (
    <div className="flex-auto bg-white rounded-lg shadow-xl border border-solid border-neutral-100">
      <div className="mx-auto w-1/2 my-12" style={{ minWidth: "38rem" }}>
        <div className="relative">
          <div className="absolute grid grid-cols-5 bg-neutral-200 rounded-lg h-3 w-1/3 left-1/2 -translate-x-1/2">
            <div className="col-span-1 bg-blue-500 rounded-lg"></div>
          </div>
          <p className="text-center font-bold text-3xl pt-6">Quelle est le nom de votre nouvelle campagne ?</p>
          <div className="text-neutral-500 my-10">
            <input
              className={`block border border-solid border-neutral-400 rounded-lg w-full p-2 ${!isInitState && title === "" ? "outline outline-offset-0 outline-1 outline-red-500" : ""}`}
              placeholder="Nom de campagne"
              value={title}
              onChange={handleChange}
            />
            <p className="text-xs">Pour vous permettre d'indentifier votre nouvelle campagne au sein de Safely</p>
            <hr className="my-6" />
            {title !== ""
            ? (
              <button className="text-lg font-bold text-white bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-lg float-right" onClick={handleClick}>
                CONTINUER
              </button>
            ) : (
              <button className="text-lg font-bold text-white bg-neutral-500 px-6 py-2 rounded-lg float-right">
                CONTINUER
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialCampaignCreationStepOne;
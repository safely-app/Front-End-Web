import { useState, useMemo } from "react";

const Card: React.FC<{
  list: string[];
  title: string;
  selectedElement: string;
  setSelectedElement: (value: string) => void;
}> = ({
  list,
  title,
  selectedElement,
  setSelectedElement,
}) => {
  return (
    <div className="border border-solid border-neutral-400 rounded-lg pt-3 pb-6 px-4">
      <span className="block text-lg">{title}</span>
      <ul>
        {list.map((element, index) => {
          return (
            <li className="font-light text-neutral-700 text-sm" key={`element-${title}-${index}`} onClick={() => setSelectedElement(element)}>
              <input className="cursor-pointer" type="checkbox" checked={element === selectedElement} onChange={(_e) => setSelectedElement(element)} />
              <label className="cursor-pointer"> {element}</label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const CommercialCampaignCreationStepThree: React.FC<{
  prevStepClick: () => void;
  nextStepClick: () => void;
}> = ({
  prevStepClick,
  nextStepClick,
}) => {
  const sexes = useMemo(() => [
    "Indifférent",
    "Homme",
    "Femme",
    "Autre"
  ], []);

  const ages = useMemo(() => [
    "18-24",
    "25-34",
    "35-44",
    "45-54",
    "55-64",
    "65-69",
    "70+"
  ], []);

  const cspCategories = useMemo(() => [
    "csp--",
    "csp-",
    "csp",
    "csp+",
    "csp++"
  ], []);


  const [selectedSex, setSelectedSex] = useState(sexes[0]);
  const [selectedAge, setSelectedAge] = useState(ages[1]);
  const [selectedCsp, setSelectedCsp] = useState(cspCategories[2]);
  const [interests, setInterests] = useState([
    "baseball", "astrologie"
  ]);

  return (
    <div className="flex-auto bg-white rounded-lg shadow-xl border border-solid border-neutral-100">
      <div className="mx-auto w-1/2 my-12" style={{ minWidth: "38rem" }}>
        <div className="relative">
          <div className="absolute grid grid-cols-5 bg-neutral-200 rounded-lg h-3 w-1/3 left-1/2 -translate-x-1/2">
            <div className="col-span-3 bg-blue-500 rounded-lg"></div>
          </div>
          <p className="text-center font-bold text-3xl pt-6">Quelle est la cible de votre campagne ?</p>
          <div className="text-neutral-500 my-10">
            <input className="block border border-solid border-neutral-400 rounded-lg w-full p-2" placeholder="Nom de la cible" />
            <p className="text-xs">Pour vous permettre d'indentifier votre nouvelle cible au sein de Safely</p>

            <div className="grid grid-cols-3 gap-6 mt-4">

              <Card
                list={sexes}
                title="Sex"
                selectedElement={selectedSex}
                setSelectedElement={setSelectedSex}
              />

              <Card
                list={ages}
                title="Tranche d'âge"
                selectedElement={selectedAge}
                setSelectedElement={setSelectedAge}
              />

              <Card
                list={cspCategories}
                title="Revenue"
                selectedElement={selectedCsp}
                setSelectedElement={setSelectedCsp}
              />

            </div>

            <div className="mt-4">
              <p>Centres d'intérêts</p>
              <p className="text-sm font-light text-neutral-600">Visez-vous un centre d'intérêt en particulier ?</p>

              <ul className="flex flex-wrap space-x-2 mt-3">
                {interests.map((interest, index) => {
                  return (
                    <li key={`interest-${index}`} className="flex-0 px-2 py-0.5 select-none border border-solid border-neutral-400 rounded-xl">
                      {interest} <div className="inline-block cursor-pointer rotate-45" onClick={() => setInterests(interests.filter(i => i !== interest))}>+</div>
                    </li>
                  );
                })}
                <li className="flex-0 px-2 py-0.5 select-none text-blue-400 cursor-pointer">+ Nouveau centre d'intérêt</li>
              </ul>
            </div>
          </div>

          <div>
            <hr className="my-6" />
            <button className="text-lg font-bold text-blue-500 bg-white hover:text-blue-400 px-6 py-2 rounded-lg float-left" onClick={prevStepClick}>
              RETOUR
            </button>
            <button className="text-lg font-bold text-white bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-lg float-right" onClick={nextStepClick}>
              CONTINUER
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommercialCampaignCreationStepThree;
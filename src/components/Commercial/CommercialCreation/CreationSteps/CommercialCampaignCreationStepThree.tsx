import { useState, useMemo, useEffect } from "react";
import { useAppSelector } from "../../../../redux";
import { Commercial } from "../../../../services";
import { notifyError } from "../../../utils";
import ITarget from "../../../interfaces/ITarget";
import { AxiosResponse } from "axios";
import log from "loglevel";

const Card: React.FC<{
  list: string[];
  title: string;
  selectedElements: string[];
  setSelectedElements: (value: string[]) => void;
}> = ({
  list,
  title,
  selectedElements,
  setSelectedElements,
}) => {
  const updateSelectedElements = (element: string) => {
    if (selectedElements.find(elem => elem === element)) {
      setSelectedElements(selectedElements.filter(elem => elem !== element));
    } else {
      setSelectedElements([ ...selectedElements, element ]);
    }
  };

  return (
    <div className="border border-solid border-neutral-400 rounded-lg pt-3 px-4 flex flex-col">
      <span className="block text-lg flex-0">{title}</span>
      <ul className="pb-3 flex-auto">
        {list.map((element, index) => {
          return (
            <li className="font-light text-neutral-700 text-sm" key={`element-${title}-${index}`} onClick={() => updateSelectedElements(element)}>
              <input className="cursor-pointer" type="checkbox" checked={selectedElements.find(elem => elem === element) !== undefined} onChange={(_e) => updateSelectedElements(element)} />
              <label className="cursor-pointer"> {element}</label>
            </li>
          );
        })}
      </ul>
      <span className={`text-xs text-red-500 pb-1 flex-0 ${selectedElements.length === 0 ? '' : 'invisible'}`}>
        Veuillez choisir une option.
      </span>
    </div>
  );
};

const CommercialCampaignCreationStepThree: React.FC<{
  prevStepClick: () => void;
  nextStepClick: () => void;
  setCampaignValue: (field: string, value: any) => void;
  targetIds: string[];
}> = ({
  prevStepClick,
  nextStepClick,
  setCampaignValue,
  targetIds,
}) => {
  const userCredentials = useAppSelector(state => state.user.credentials);

  const sexes = useMemo(() => [
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

  const [name, setName] = useState("");
  const [interestField, setInterestField] = useState("");
  const [displayInterestInput, setDisplayInterestInput] = useState(false);

  const [selectedAges, setSelectedAges] = useState([ ages[1] ]);
  const [selectedSexes, setSelectedSexes] = useState([ sexes[0] ]);
  const [selectedCsps, setSelectedCsps] = useState([ cspCategories[2] ]);
  const [interests, setInterests] = useState<string[]>([]);

  const [targets, setTargets] = useState<ITarget[]>([]);

  const handleClick = async () => {
    try {
      // delete previous targets
      for (const target of targets) {
        Commercial.deleteTarget(target.id, userCredentials.token)
          .catch(err => log.error(err));
      }

      let targetsPromise: Promise<AxiosResponse<any>>[] = [];

      // add create target promise to array
      for (const csp of selectedCsps) {
        for (const age of selectedAges) {
          targetsPromise.push(
            Commercial.createTarget({
              id: "",
              csp: csp,
              name: name,
              ownerId: userCredentials._id,
              ageRange: age === ages[ages.length - 1] ? `${age.slice(0, 2)}-99` : age,
              interests: interests
            }, userCredentials.token)
          );
        }
      }

      // wait for all promise to succeed and get results
      const createdTargets = await Promise.all(targetsPromise);
      const targetsId = createdTargets.map(target => target.data._id as string);

      setCampaignValue("targets", targetsId);
      nextStepClick();
    } catch (err) {
      notifyError(err);
      log.error(err);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && interestField !== "") {
      setInterests([ ...interests, interestField ]);
      setDisplayInterestInput(false);
      setInterestField("");
    }
  };

  useEffect(() => {
    const getSetValues = (set: Set<string>): string[] => {
      const values: string[] = [];
      const valueIterator = set.values();

      for (let value = valueIterator.next().value; value !== undefined; value = valueIterator.next().value)
        values.push(value);

      return values;
    };

    if (targets.length > 0) {
      const gotCsps = targets.map(target => target.csp);
      const gotAges = targets.map(target => target.ageRange);
      const gotInterests = targets.flatMap(target => target.interests);

      const uniqueAges = getSetValues(new Set(gotAges))
        .map(age => (age === `${ages[ages.length - 1].slice(0, 2)}-99`) ? ages[ages.length - 1] : age);


      setName(targets[0].name);
      setSelectedAges(uniqueAges);
      setSelectedCsps(getSetValues(new Set(gotCsps)));
      setInterests(getSetValues(new Set(gotInterests)));
    }
  }, [targets, ages])

  useEffect(() => {
    Commercial.getAllTargetByOwner(userCredentials._id, userCredentials.token)
      .then(result => {
        const gotTargets = result.data.map(target => ({
          id: target._id,
          ownerId: target.ownerId,
          name: target.name,
          csp: target.csp,
          interests: target.interests,
          ageRange: target.ageRange
        })).filter(target => targetIds.includes(target.id));

        setTargets(gotTargets);
      }).catch(err => log.error(err));
  }, [userCredentials, targetIds]);

  return (
    <div className="flex-auto bg-white rounded-lg shadow-xl border border-solid border-neutral-100">
      <div className="mx-auto w-1/2 my-12" style={{ minWidth: "38rem" }}>
        <div className="relative">
          <div className="absolute grid grid-cols-5 bg-neutral-200 rounded-lg h-3 w-1/3 left-1/2 -translate-x-1/2">
            <div className="col-span-3 bg-blue-500 rounded-lg"></div>
          </div>
          <p className="text-center font-bold text-3xl pt-6">Quelle est la cible de votre campagne ?</p>
          <div className="text-neutral-500 my-10">
            <input
              className="block border border-solid border-neutral-400 rounded-lg w-full p-2"
              placeholder="Nom de la cible"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={50}
            />
            <p className="text-xs">Pour vous permettre d'indentifier votre nouvelle cible au sein de Safely</p>

            <div className="grid grid-cols-3 gap-6 mt-4">

              <Card
                list={sexes}
                title="Sexe"
                selectedElements={selectedSexes}
                setSelectedElements={setSelectedSexes}
              />

              <Card
                list={ages}
                title="Tranche d'âge"
                selectedElements={selectedAges}
                setSelectedElements={setSelectedAges}
              />

              <Card
                list={cspCategories}
                title="Revenue"
                selectedElements={selectedCsps}
                setSelectedElements={setSelectedCsps}
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
                <input
                  hidden={!displayInterestInput}
                  className="flex-0 px-2 py-0.5 border border-solid border-neutral-400 rounded-xl focus:outline-none w-36"
                  value={interestField}
                  onChange={(event) => setInterestField(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="flex-0 px-2 py-0.5 select-none text-blue-500" onClick={() => setDisplayInterestInput(true)}>
                  + Nouveau centre d'intérêt
                </button>
              </ul>
            </div>
          </div>

          <div>
            <hr className="my-6" />
            <button className="text-lg font-bold text-blue-500 bg-white hover:text-blue-400 px-6 py-2 rounded-lg float-left" onClick={prevStepClick}>
              RETOUR
            </button>
            {selectedAges.length && selectedCsps.length && selectedSexes.length
              ? (
                <button className="text-lg font-bold text-white bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-lg float-right" onClick={handleClick}>
                  CONTINUER
                </button>
              ) : (
                <button className="text-lg font-bold text-white bg-neutral-500 px-6 py-2 rounded-lg float-right">
                  CONTINUER
                </button>
              )
            }
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommercialCampaignCreationStepThree;
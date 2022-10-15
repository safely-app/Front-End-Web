import React, {useState, useMemo} from "react";
import { AiFillCheckCircle } from 'react-icons/ai';

const CampaignBudget: React.FC<{
  prevStepClick: () => void;
  nextStepClick: () => void;
  setCampaignValue: (field: string, value: any) => void;
  campaignPrice: number;
}> = ({
  prevStepClick,
  nextStepClick,
  setCampaignValue,
  campaignPrice
}) => {
  const minPrice = useMemo(() => 10, []);
  const maxPrice = useMemo(() => 1000, []);
  const prices = useMemo(() => [ 10, 25, 100 ], []);

  const [isPredefined, setIsPredefined] = useState(prices.includes(campaignPrice));
  const [selectedPrice, setSelectedPrice] = useState(campaignPrice);

  const setSelectedPriceFromInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(event.target.value);

    if (parsedValue > maxPrice) {
      setSelectedPrice(maxPrice);
    } else {
      setSelectedPrice(parsedValue);
    }
  };

  const handleClick = () => {
    setCampaignValue("budget", selectedPrice);
    nextStepClick();
  };

  return (
    <div className="flex-auto bg-white rounded-lg shadow-xl border border-solid border-neutral-100">
      <div className="mx-auto w-1/2 my-12" style={{ minWidth: "38rem" }}>
        <div className="relative">
          <div className="absolute grid grid-cols-6 bg-neutral-200 rounded-lg h-3 w-1/3 left-1/2 -translate-x-1/2">
            <div className="col-span-2 bg-blue-500 rounded-lg"></div>
          </div>
          <p className="text-center font-bold text-3xl pt-6">Déterminez le budget de votre campagne</p>
          <div className="my-10 space-y-4 mx-auto w-2/3" style={{ maxWidth: '40rem', minWidth: '38rem' }}>

            <div>
              <input type="radio" checked={isPredefined} onChange={(_e) => setIsPredefined(true)} />
              <label className="font-bold pl-4">Sélectionner un budget</label>
              <div hidden={!isPredefined}>
                <ul className="p-4 space-y-3">
                  {prices.map((price, index) => {
                    return (
                      <li
                        key={`predefined-price-${index}`}
                        onClick={() => setSelectedPrice(prices[index])}
                        className={`relative py-2 px-4 rounded-lg cursor-pointer border border-solid ${(selectedPrice === price) ? 'border-blue-400' : 'border-neutral-400}'}`}
                      >
                        <p className="text-neutral-600"><span className="text-4xl text-black">{price}€</span> mensuels - équivaut à {(price / 30).toFixed(1)}€ chaque jour</p>
                        <p className="text-neutral-600 text-sm pt-4">Estimation de {price * 5} cliques sur votre publicité chaque mois</p>
                        <AiFillCheckCircle
                          className={`absolute top-0 right-0 w-7 h-7 text-blue-400 translate-x-1/3 -translate-y-1/3 ${(selectedPrice !== price) ? 'hidden' : ''}`}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div>
              <input type="radio" checked={!isPredefined} onChange={(_e) => setIsPredefined(false)} />
              <label className="font-bold pl-4">Définir un budget personnalisé</label>
              <div hidden={isPredefined}>
                <div className="p-6 flex">
                  <div className="flex-0 relative border border-solid border-neutral-400 rounded-lg w-20 h-10">
                    <input
                      type="number"
                      className="text-xl w-full h-full pl-0.5 pr-4 text-right rounded-lg"
                      value={selectedPrice}
                      onChange={setSelectedPriceFromInput}
                    />
                    <span className="absolute text-xl top-1/2 right-1 -translate-y-1/2">€</span>
                  </div>
                  <div className="ml-2 flex-auto text-sm text-neutral-600" hidden={!isNaN(selectedPrice)}>
                    <p>mensuels - équivaut à 0.0€ chaque jour</p>
                    <p>Estimation de 0 cliques sur votre publicité chaque mois</p>
                  </div>
                  <div className="ml-2 flex-auto text-sm text-neutral-600" hidden={isNaN(selectedPrice)}>
                    <p>mensuels - équivaut à {(selectedPrice / 30).toFixed(1)}€ chaque jour</p>
                    <p>Estimation de {selectedPrice * 5} cliques sur votre publicité chaque mois</p>
                  </div>
                </div>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  className="w-2/3 mx-4"
                  value={isNaN(selectedPrice) ? minPrice : selectedPrice}
                  onChange={setSelectedPriceFromInput}
                />
              </div>
            </div>

            <div className="text-neutral-500">
              <hr className="my-6" />
              <button className="text-lg font-bold text-blue-500 bg-white hover:text-blue-400 px-6 py-2 rounded-lg float-left" onClick={prevStepClick}>
                RETOUR
              </button>
              <button className="text-lg font-bold text-white bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-lg float-right" onClick={handleClick}>
                CONTINUER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBudget;
import nock from "nock";
import {fireEvent, render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import {store} from "../../../redux";
import {CampaignBudget, CampaignName, CampaignTarget} from "./CreationSteps";
import {act} from "react-dom/test-utils";
import CommercialCampaignCreation from "./CommercialCampaignCreation";
import ICampaign from "../../interfaces/ICampaign";
import ISafeplace from "../../interfaces/ISafeplace";

const testURL: string = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('render CampaignName', () => {
  const onClick = jest.fn();
  const setCampaignValue = jest.fn();

  render(
    <Provider store={store}>
      <CampaignName
        onClick={onClick}
        setCampaignValue={setCampaignValue}
        campaignTitle=""
      />
    </Provider>
  );

  expect(screen.getByPlaceholderText("Nom de campagne")).toBeInTheDocument();
  expect(screen.getByText("CONTINUER")).toBeInTheDocument();

  fireEvent.click(screen.getByText("CONTINUER"));

  fireEvent.change(screen.getByPlaceholderText("Nom de campagne"), { target: { value: "New title" } });
  fireEvent.click(screen.getByText("CONTINUER"));

  expect(onClick).toBeCalledTimes(1);
  expect(setCampaignValue).toBeCalled();
});

test('render CampaignBudget', () => {
  const prevStepClick = jest.fn();
  const nextStepClick = jest.fn();
  const setCampaignValue = jest.fn();

  render(
    <Provider store={store}>
      <CampaignBudget
        prevStepClick={prevStepClick}
        nextStepClick={nextStepClick}
        setCampaignValue={setCampaignValue}
        campaignPrice={0}
      />
    </Provider>
  );

  expect(screen.getByText("RETOUR")).toBeInTheDocument();
  expect(screen.getByText("CONTINUER")).toBeInTheDocument();
  expect(screen.getByText("Sélectionner un budget")).toBeInTheDocument();
  expect(screen.getByText("Définir un budget personnalisé")).toBeInTheDocument();

  fireEvent.click(screen.getByText("RETOUR"));

  fireEvent.click(screen.getByText("Définir un budget personnalisé"));
  fireEvent.change(screen.getByRole("slider"), { target: { value: "250" } });
  fireEvent.click(screen.getByText("CONTINUER"));

  expect(prevStepClick).toBeCalled();
  expect(nextStepClick).toBeCalledTimes(1);
  expect(setCampaignValue).toBeCalled();
});

test('render CampaignTarget', async () => {
  const prevStepClick = jest.fn();
  const nextStepClick = jest.fn(targets => targets);
  const targets = [
    {
      _id: "t1",
      ownerId: "b1",
      name: "Target 1",
      csp: "csp",
      interests: [ 'shoes' ],
      ageRange: "18-24",
    },
    {
      _id: "t2",
      ownerId: "b1",
      name: "Target 2",
      csp: "csp--",
      interests: [ 'shoes' ],
      ageRange: "18-24",
    }
  ];

  const createdTargetId = "ntID1";
  const createdTarget = {
    ownerId: "",
    name: "New target name",
    csp: "csp",
    interests: [ 'shoes' ],
    ageRange: "25-44",
  };

  const scopeGetOwnerAll = nock(testURL).get('/commercial/target/owner/')
    .reply(200, targets, { 'Access-Control-Allow-Origin': '*' });

  const scopeOptions1 = nock(testURL).options('/commercial/target/t1')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeDelete1 = nock(testURL).delete('/commercial/target/t1')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

  const scopeOptions2 = nock(testURL).options('/commercial/target/t2')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeDelete2 = nock(testURL).delete('/commercial/target/t2')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

  const scopeCreate = nock(testURL).post('/commercial/target', createdTarget)
    .reply(200, { _id: createdTargetId }, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <CampaignTarget
        prevStepClick={prevStepClick}
        nextStepClick={nextStepClick}
        targetIds={targets.map(target => target._id)}
      />
    </Provider>
  );

  await act(async () => await testDelay(500));

  scopeGetOwnerAll.done();

  expect(screen.getByPlaceholderText("Nom de la cible")).toBeInTheDocument();
  expect(screen.getByText(/18-24/i)).toBeInTheDocument();
  expect(screen.getByText(/25-34/i)).toBeInTheDocument();
  expect(screen.getByText(/35-44/i)).toBeInTheDocument();
  expect(screen.getByText(/csp--/i)).toBeInTheDocument();
  expect(screen.getByText("CONTINUER")).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText("Nom de la cible"), {
    target: { value: createdTarget.name }
  });

  fireEvent.click(screen.getByText(/18-24/i));
  fireEvent.click(screen.getByText(/25-34/i));
  fireEvent.click(screen.getByText(/35-44/i));
  fireEvent.click(screen.getByText(/csp--/i));

  fireEvent.click(screen.getByText("CONTINUER"));

  await act(async () => await testDelay(500));

  scopeOptions1.done();
  scopeDelete1.done();
  scopeOptions2.done();
  scopeDelete2.done();

  scopeCreate.done();

  expect(nextStepClick).toBeCalled();
  expect(nextStepClick.mock.results[0].value).toStrictEqual([ createdTargetId ]);
});

// test('render CampaignAdvertising', async () => {
//   const prevStepClick = jest.fn();
//   const nextStepClick = jest.fn();
//   const targetsId = [ "t1", "t2" ];
//   const campaignId = "c1";
//
//   const scopeCreate = nock(testURL).post("/commercial/advertising")
//     .reply(201, {  }, { 'Access-Control-Allow-Origin': '*' });
//
//   render(
//     <Provider store={store}>
//       <CampaignAdvertising
//         prevStepClick={prevStepClick}
//         nextStepClick={nextStepClick}
//         campaignId={campaignId}
//         targetIds={targetsId}
//       />
//     </Provider>
//   );
//
//   expect(screen.getByText("RETOUR")).toBeInTheDocument();
//   expect(screen.getByText("CONTINUER")).toBeInTheDocument();
//
//   fireEvent.click(screen.getByText("RETOUR"));
//   fireEvent.click(screen.getByText("CONTINUER"));
//
//   expect(screen.getByPlaceholderText(/Titre/i)).toBeInTheDocument();
//   expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
//
//   fireEvent.change(screen.getByPlaceholderText(/Titre/i), {
//     target: { value: "Le titre de la pub" }
//   });
//
//   fireEvent.change(screen.getByPlaceholderText(/Description/i), {
//     target: { value: "La description de la pub" }
//   });
//
//   fireEvent.change(screen.getByTestId("ad-upload-image"), {
//     target: {
//       files: [
//         new File([""], "image.png")
//       ]
//     }
//   });
//
//   await act(async () => await testDelay(500));
//   expect(scopeCreate.isDone()).toBeFalsy();
//
//   fireEvent.click(screen.getByText("CONTINUER"));
//
//   await act(async () => await testDelay(500));
//
//   expect(prevStepClick).toBeCalled();
//   expect(nextStepClick).toBeCalledTimes(1);
//
//   scopeCreate.done();
// });

test('render CommercialCampaignCreation', async () => {
  const safeplace: ISafeplace = {
    id: "s1",
    name: "Safeplace 1",
    description: "Description 1",
    city: "City 1",
    address: "Address 1",
    type: "Type 1",
    dayTimetable: [ null, null, null, null, null, null, null ],
    coordinate: [ "42", "28" ],
    ownerId: "user1",
  };

  const onEnd = jest.fn();
  const setCampaigns = jest.fn();
  const campaigns: ICampaign[] = [
    {
      id: "c1",
      ownerId: "user1",
      name: "Campaign 1",
      budget: 500,
      budgetSpent: 250,
      status: "active",
      safeplaceId: "s1",
      startingDate: "2022-10-20",
      targets: [ "t1", "t2" ],
    },
    {
      id: "c2",
      ownerId: "user1",
      name: "Campaign 2",
      budget: 500,
      budgetSpent: 250,
      status: "active",
      safeplaceId: "s1",
      startingDate: "2022-10-20",
      targets: [ "t1", "t2" ],
    }
  ];

  render(
    <Provider store={store}>
      <CommercialCampaignCreation
        safeplace={safeplace}
        campaigns={campaigns}
        setCampaigns={setCampaigns}
        onEnd={onEnd}
      />
    </Provider>
  );
});

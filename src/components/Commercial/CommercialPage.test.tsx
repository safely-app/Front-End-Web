import { fireEvent, render, screen } from '@testing-library/react';
import { store } from '../../redux';
import { Provider } from 'react-redux';
import CommercialCampaigns from './CommercialCampaigns';
import CampaignModal from './CommercialCampaignModal';
import ICampaign from '../interfaces/ICampaign';
import TargetModal from './CommercialTargetModal';
import ITarget from '../interfaces/ITarget';
import MultipleTargetsModal from './CommercialMultipleTargetsModal';
import nock from "nock";
import { act } from 'react-dom/test-utils';

const testURL: string = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('render CommercialCampaigns', async () => {
  const setCampaigns = jest.fn();
  const setTargets = jest.fn();

  const scopecCampaignOptions = nock(testURL).options('/commercial/campaign/a1')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeCampaignDelete = nock(testURL).delete('/commercial/campaign/a1')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

  const campaigns = [
    {
      id: "a1",
      ownerId: "b1",
      name: "Campagne 1",
      budget: 50,
      budgetSpent: 15,
      status: "active",
      startingDate: "2022-08-08",
      targets: [ 't1', 't2', 't3' ],
    }
  ];

  const targets = [
    {
      id: "t1",
      ownerId: "b1",
      name: "Target 1",
      csp: "csp",
      interests: [ 'shoes' ],
      ageRange: "10-20",
    },
    {
      id: "t2",
      ownerId: "b1",
      name: "Target 2",
      csp: "csp--",
      interests: [ 'shoes' ],
      ageRange: "10-20",
    },
    {
      id: "t3",
      ownerId: "b1",
      name: "Target 3",
      csp: "csp++",
      interests: [ 'shoes' ],
      ageRange: "10-20",
    }
  ];

  const safeplace = {
    id: "s1",
    type: "resto",
    city: "Ville",
    name: "Safeplace 1",
    address: "Adresse",
    description: "Description",
    dayTimetable: [ null, null, null, null, null, null, null ],
    coordinate: [ "1", "1" ],
    ownerId: "",
  };

  render(
    <Provider store={store}>
      <CommercialCampaigns
        safeplace={safeplace}
        campaigns={campaigns}
        setCampaigns={setCampaigns}
        targets={targets}
        setTargets={setTargets}
      />
    </Provider>
  );

  expect(screen.getByText(/50/i)).toBeInTheDocument();
  expect(screen.getByText(/Campagne 1/i)).toBeInTheDocument();
  expect(screen.getByText(/2022-08-08/i)).toBeInTheDocument();

  expect(screen.getByPlaceholderText('Rechercher une campagne...')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Rechercher une campagne...'), { target: { value: "2022-08-08" } });

  expect(screen.getByTestId('utmb-14')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('utmb-14'));

  expect(screen.getByTestId('ucmb-15')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('ucmb-15'));

  expect(screen.getByTestId('dcmb-15')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('dcmb-15'));

  screen.getAllByText('Annuler').forEach(button => {
    fireEvent.click(button);
  });

  await act(async () => await testDelay(1000));

  scopecCampaignOptions.done();
  scopeCampaignDelete.done();
});

test('render CommercialCampaignModal', () => {
  const setModalOn = jest.fn();
  const setCampaign = jest.fn();

  const campaign: ICampaign = {
    id: "a1",
    ownerId: "b1",
    name: "Campagne 1",
    budget: 50,
    budgetSpent: 11,
    status: "active",
    startingDate: "2022-08-08",
    targets: [ 't1', 't2', 't3' ],
  };

  const targets = [
    {
      id: "t1",
      ownerId: "b1",
      name: "Target 1",
      csp: "csp",
      interests: [ 'shoes' ],
      ageRange: "10-20",
    },
    {
      id: "t2",
      ownerId: "b1",
      name: "Target 2",
      csp: "csp--",
      interests: [ 'shoes' ],
      ageRange: "10-20",
    },
    {
      id: "t3",
      ownerId: "b1",
      name: "Target 3",
      csp: "csp++",
      interests: [ 'shoes' ],
      ageRange: "10-20",
    }
  ];

  render(
    <Provider store={store}>
      <CampaignModal
        title=''
        modalOn={true}
        setModalOn={setModalOn}
        targets={targets}
        campaign={campaign}
        setCampaign={setCampaign}
        buttons={[]}
      />
    </Provider>
  );

  expect(screen.getByTestId('modalon-btn')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('modalon-btn'));
  expect(setModalOn).toBeCalled();

  expect(screen.getByPlaceholderText('Nom')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: "Campagne 2" } });

  expect(screen.getByPlaceholderText('Budget')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Budget'), { target: { value: "49" } });

  expect(screen.getByPlaceholderText('Date de départ')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Date de départ'), { target: { value: "2022-09-09" } });

  expect(screen.getByPlaceholderText('Rechercher une cible...')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Rechercher une cible...'), { target: { value: "t1" } });

  expect(screen.getByTestId('rft-0')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('rft-0'));

  expect(setCampaign).toBeCalledTimes(4);
});

test('render CommercialTargetModal', () => {
  const setTarget = jest.fn();

  const target: ITarget = {
    id: "t1",
    ownerId: "b1",
    name: "Target 1",
    csp: "csp",
    interests: [ 'shoes' ],
    ageRange: "10-20",
  };

  render(
    <Provider store={store}>
      <TargetModal
        title=''
        modalOn={true}
        target={target}
        setTarget={setTarget}
        buttons={[]}
      />
    </Provider>
  );

  expect(screen.getByPlaceholderText('Nom')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: "Target T1" } });

  expect(screen.getByRole('combobox')).toBeInTheDocument();
  fireEvent.change(screen.getByRole('combobox'), { target: { value: "csp++" } });

  expect(screen.getByPlaceholderText("Fourchette d'âge")).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText("Fourchette d'âge"), { target: { value: "20-30" } });

  expect(screen.getByTestId('tir-btn-0')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('tir-btn-0'));

  expect(screen.getByPlaceholderText("Ajouter un centre d'intérêt")).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText("Ajouter un centre d'intérêt"), { target: { value: "ball" } });
  fireEvent.keyPress(screen.getByPlaceholderText("Ajouter un centre d'intérêt"), { key: 'Enter', charCode: 13 });

  expect(setTarget).toBeCalledTimes(5);
});

test('render CommercialMultipleTargetsModal', () => {
  const setModalOn = jest.fn();
  const setTarget = jest.fn();

  const campaign: ICampaign = {
    id: "a1",
    ownerId: "b1",
    name: "Campagne 1",
    budget: 50,
    budgetSpent: 11,
    status: "active",
    startingDate: "2022-08-08",
    targets: [ 't1', 't2', 't3' ],
  };

  const targets = [
    {
      id: "t1",
      ownerId: "b1",
      name: "Target 1",
      csp: "csp",
      interests: [ 'shoes' ],
      ageRange: "10-20",
    },
    {
      id: "t2",
      ownerId: "b1",
      name: "Target 2",
      csp: "csp--",
      interests: [ 'shoes' ],
      ageRange: "10-20",
    },
    {
      id: "t3",
      ownerId: "b1",
      name: "Target 3",
      csp: "csp++",
      interests: [ 'shoes' ],
      ageRange: "10-20",
    }
  ];

  render(
    <Provider store={store}>
      <MultipleTargetsModal
        title=''
        modalOn={true}
        setModalOn={setModalOn}
        targets={targets}
        setTarget={setTarget}
        campaign={campaign}
        buttons={[]}
      />
    </Provider>
  );

  expect(screen.getByTestId('ct-0')).toBeInTheDocument();
  expect(screen.getByTestId('ct-1')).toBeInTheDocument();
  expect(screen.getByTestId('ct-2')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('ct-0'));

  expect(setTarget).toBeCalled();
});

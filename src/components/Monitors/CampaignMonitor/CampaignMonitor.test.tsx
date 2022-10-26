import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import CampaignMonitor from "./CampaignMonitor";
import nock from 'nock';
import ITarget from '../../interfaces/ITarget';
import ICampaign from '../../interfaces/ICampaign';
import { CampaignModal } from './CampaignMonitorModal';

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('render CampaignMonitor', async () => {
  const campaigns: ICampaign[] = [
    {
      id: "c1",
      name: "Campagne 1",
      budget: "100",
	    budgetSpent: "10",
      status: "active",
      startingDate: "2022-08-08",
      targets: [ 't1' ],
      ownerId: "1"
    }
  ];

  const finalCampaigns = campaigns.map(campaign =>
    ({ ...campaign, _id: campaign.id })
  );

  const scopeTarget = nock(process.env.REACT_APP_SERVER_URL as string)
    .get('/commercial/target').reply(200, [], { 'Access-Control-Allow-Origin': '*' });
  const scopeCampaign = nock(process.env.REACT_APP_SERVER_URL as string)
    .get('/commercial/campaign').reply(200, finalCampaigns, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <CampaignMonitor />
    </Provider>
  );

  await act(async () => testDelay(1000));

  expect(screen.getByPlaceholderText('Rechercher une campagne...')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Rechercher une campagne...'), { target: { value: "active" } });

  screen.getAllByText('Annuler').forEach(button => {
    fireEvent.click(button);
  });

  scopeCampaign.done();
  scopeTarget.done();
});

test('render CampaignMonitor create modal', async () => {
  const targets: ITarget[] = [
    {
      id: "1",
      csp: "csp",
      name: "Target 1",
      ageRange: "10-20",
      interests: [ 'shoes' ],
      ownerId: "1"
    }
  ];

  const scopeTarget = nock(process.env.REACT_APP_SERVER_URL as string)
    .get('/commercial/target').reply(200, targets, { 'Access-Control-Allow-Origin': '*' });
  const scopeCampaign = nock(process.env.REACT_APP_SERVER_URL as string)
    .get('/commercial/campaign').reply(200, [], { 'Access-Control-Allow-Origin': '*' });
  const scopeCampaignCreate = nock(process.env.REACT_APP_SERVER_URL as string)
    .post('/commercial/campaign').reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <CampaignMonitor />
    </Provider>
  );

  expect(screen.getByText('Créer une nouvelle campagne')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Créer une nouvelle campagne'));

  fireEvent.change(screen.getAllByPlaceholderText('Nom')[0], { target: { value: "Campagne 1" } });
  fireEvent.change(screen.getAllByPlaceholderText('Budget')[0], { target: { value: "50" } });
  fireEvent.change(screen.getAllByPlaceholderText('Date de départ')[0], { target: { value: "2022-08-08" } });
  fireEvent.change(screen.getAllByPlaceholderText('Rechercher une cible...')[0], { target: { value: "Target 1" } });

  fireEvent.click(screen.getByText('Créer la campagne'));

  await act(async () => testDelay(1000));

  scopeCampaignCreate.done();
  scopeCampaign.done();
  scopeTarget.done();
});

test('render CampaignMonitor update modal', async () => {
  const targets: ITarget[] = [
    {
      id: "t1",
      csp: "csp",
      name: "Target 1",
      ageRange: "10-20",
      interests: [ 'shoes' ],
      ownerId: "1"
    }
  ];

  const campaigns: ICampaign[] = [
    {
      id: "c1",
      name: "Campagne 1",
      budget: "100",
	    budgetSpent: "50",
      status: "active",
      startingDate: "2022-08-08",
      targets: [ 't1' ],
      ownerId: "1"
    }
  ];

  const finalCampaigns = campaigns.map(campaign =>
    ({ ...campaign, _id: campaign.id })
  );

  const scopeTarget = nock(process.env.REACT_APP_SERVER_URL as string)
    .get('/commercial/target').reply(200, targets, { 'Access-Control-Allow-Origin': '*' });
  const scopeCampaign = nock(process.env.REACT_APP_SERVER_URL as string)
    .get('/commercial/campaign').reply(200, finalCampaigns, { 'Access-Control-Allow-Origin': '*' });
  const scopeCampaignOptions = nock(process.env.REACT_APP_SERVER_URL as string)
    .options('/commercial/campaign/c1').reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeCampaignUpdate = nock(process.env.REACT_APP_SERVER_URL as string)
    .put('/commercial/campaign/c1').reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <CampaignMonitor />
    </Provider>
  );

  await act(async () => testDelay(1000));

  expect(screen.getByTestId('cu-btn-15')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('cu-btn-15'));

  expect(screen.getByText('Campagne 1')).toBeInTheDocument();
  expect(screen.getByText('2022-08-08')).toBeInTheDocument();
  expect(screen.getByText('50/100')).toBeInTheDocument();

  fireEvent.change(screen.getAllByPlaceholderText('Nom')[1], { target: { value: "Campagne 1" } });
  fireEvent.change(screen.getAllByPlaceholderText('Budget')[1], { target: { value: "50" } });
  fireEvent.change(screen.getAllByPlaceholderText('Date de départ')[1], { target: { value: "2022-08-08" } });
  fireEvent.change(screen.getAllByPlaceholderText('Rechercher une cible...')[1], { target: { value: "Target 1" } });

  fireEvent.click(screen.getByText('Modifier la campagne'));

  await act(async () => testDelay(1000));

  scopeCampaignOptions.done();
  scopeCampaignUpdate.done();
  scopeCampaign.done();
  scopeTarget.done();
});

test('render CampaignMonitor delete campaign', async () => {
  const campaigns: ICampaign[] = [
    {
      id: "c1",
      name: "Campagne 1",
      budget: "100",
	    budgetSpent: "0",
      status: "active",
      startingDate: "2022-08-08",
      targets: [ 't1' ],
      ownerId: "1"
    }
  ];

  const finalCampaigns = campaigns.map(campaign =>
    ({ ...campaign, _id: campaign.id })
  );

  const scopeTarget = nock(process.env.REACT_APP_SERVER_URL as string)
    .get('/commercial/target').reply(200, [], { 'Access-Control-Allow-Origin': '*' });
  const scopeCampaign = nock(process.env.REACT_APP_SERVER_URL as string)
    .get('/commercial/campaign').reply(200, finalCampaigns, { 'Access-Control-Allow-Origin': '*' });
  const scopeCampaignOptions = nock(process.env.REACT_APP_SERVER_URL as string)
    .options('/commercial/campaign/c1').reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeCampaignDelete = nock(process.env.REACT_APP_SERVER_URL as string)
    .delete('/commercial/campaign/c1').reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <CampaignMonitor />
    </Provider>
  );

  await act(async () => testDelay(1000));

  expect(screen.getByTestId('cd-btn-15')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('cd-btn-15'));

  await act(async () => testDelay(1000));

  scopeCampaignOptions.done();
  scopeCampaignDelete.done();
  scopeCampaign.done();
  scopeTarget.done();
});

test('render CampaignMonitorModal', () => {
  const setCampaign = jest.fn();

  const campaign: ICampaign = {
    id: "c1",
    name: "Campagne 1",
    budget: "100",
	  budgetSpent: "15",
    status: "active",
    startingDate: "2022-08-08",
    targets: [ 't1' ],
    ownerId: "1"
  };

  const targets: ITarget[] = [
    {
      id: "t1",
      csp: "csp",
      name: "Target 1",
      ageRange: "10-20",
      interests: [ 'shoes' ],
      ownerId: "1"
    }
  ];

  render(
    <Provider store={store}>
      <CampaignModal
        title=''
        modalOn={true}
        targets={targets}
        campaign={campaign}
        setCampaign={setCampaign}
        buttons={[]}
      />
    </Provider>
  );

  expect(screen.getByTestId("dct-btn-0")).toBeInTheDocument();
  fireEvent.click(screen.getByTestId("dct-btn-0"));

  expect(screen.getByPlaceholderText('Rechercher une cible...')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Rechercher une cible...'), { target: { value: "Target 1" } });
  expect(screen.getByTestId('fct-0')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('fct-0'));

  expect(setCampaign).toBeCalledTimes(2);
});
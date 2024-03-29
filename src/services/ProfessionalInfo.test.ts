import IProfessional from '../components/interfaces/IProfessional';
import { ProfessionalInfo } from './index';
import nock from 'nock';

const baseURL = 'https://api.safely-app.fr';

test('get all professional', async () => {
  const scope = nock(baseURL)
    .get('/professionalinfo')
    .reply(200, [
      { userId: "1" },
      { userId: "2" }
    ], {
      'Access-Control-Allow-Origin': '*'
    });

  const response = await ProfessionalInfo.getAll('');
  expect(response.status).toEqual(200);
  scope.done();
});

test('get professional from owner', async () => {
  const scope = nock(baseURL)
    .get("/professionalinfo/owner/1")
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

  const response = await ProfessionalInfo.getOwner("1", "");
  expect(response.status).toEqual(200);
  scope.done();
});

test('get professional', async () => {
  const scope = nock(baseURL)
    .get('/professionalinfo/1')
    .reply(200, {
      userId: "1"
    }, {
      'Access-Control-Allow-Origin': '*'
    });

  const response = await ProfessionalInfo.get('1', '');
  expect(response.status).toEqual(200);
  scope.done();
});

test('create new professional', async () => {
  const scope = nock(baseURL)
    .post('/professionalinfo')
    .reply(200, {
      message: 'Success'
    }, {
      'Access-Control-Allow-Origin': '*'
    });

  const professional: IProfessional = {
    id: "",
    userId: "",
    companyName: "Entreprise test",
    companyAddress: "13 Allée des Cèdres",
    companyAddress2: "78350 Jouy-en-Josas",
    personalPhone: "06 12 12 12 12",
    companyPhone: "03 12 12 12 12",
    billingAddress: "13 Allée des Cèdres 78350 Jouy-en-Josas",
    clientNumberTVA: "1234567898765",
    type: ""
  };

  const response = await ProfessionalInfo.create(professional);
  expect(response.status).toEqual(200);
  scope.done();
});

test('try to create new professional with invalid data', async () => {
  const professional: IProfessional = {
    id: "",
    userId: "",
    companyName: "Entreprise test",
    companyAddress: "13 Allée des Cèdres",
    companyAddress2: "78350 Jouy-en-Josas",
    personalPhone: "06 12 12 12 12",
    companyPhone: "03 12 12 12 12",
    billingAddress: "13 Allée des Cèdres 78350 Jouy-en-Josas",
    clientNumberTVA: "",
    type: ""
  };

  expect(() => ProfessionalInfo.create(professional))
    .toThrow(new Error("Numéro d'identification à la TVA invalide"));
});

test('update professional', async () => {
  const optionsScope = nock(baseURL)
    .options('/professionalinfo/1')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
  const scope = nock(baseURL)
    .put('/professionalinfo/1')
    .reply(200, {
      message: 'Success'
    }, {
      'Access-Control-Allow-Origin': '*'
    });

  const professional: IProfessional = {
    id: "",
    userId: "",
    companyName: "Entreprise test",
    companyAddress: "13 Allée des Cèdres",
    companyAddress2: "78350 Jouy-en-Josas",
    personalPhone: "06 12 12 12 12",
    companyPhone: "03 12 12 12 12",
    billingAddress: "13 Allée des Cèdres 78350 Jouy-en-Josas",
    clientNumberTVA: "1234567898765",
    type: ""
  };

  const response = await ProfessionalInfo.update('1', professional, '');
  expect(response.status).toEqual(200);
  optionsScope.done();
  scope.done();
});

test('try to update professional with invalid data', async () => {
  const professional: IProfessional = {
    id: "",
    userId: "",
    companyName: "Entreprise test",
    companyAddress: "13 Allée des Cèdres",
    companyAddress2: "78350 Jouy-en-Josas",
    personalPhone: "06 12 12 12 12",
    companyPhone: "03 12 12 12 12",
    billingAddress: "13 Allée des Cèdres 78350 Jouy-en-Josas",
    clientNumberTVA: "",
    type: ""
  };

  expect(() => ProfessionalInfo.update('1', professional, ''))
    .toThrow(new Error("Numéro d'identification à la TVA invalide"));
});

test('delete professional', async () => {
  const optionsScope = nock(baseURL)
    .options('/professionalinfo/1')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
  const scope = nock(baseURL)
    .delete('/professionalinfo/1')
    .reply(200, {
      message: 'Success'
    }, {
      'Access-Control-Allow-Origin': '*'
    });

  const response = await ProfessionalInfo.delete('1', '');
  expect(response.status).toEqual(200);
  scope.done();
});

import { render, screen, act, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { store } from '../../../redux';
import CommentMonitor from "./CommentMonitor";
import nock from "nock";
import IComment from "../../interfaces/IComment";

const testUrl = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('render CommentMonitor', async () => {
  const scopeComment = nock(testUrl)
    .get('/safeplace/comment')
    .reply(200, [
      {
        id: "c1",
        _id: "c1",
        userId: "1",
        safeplaceId: "s1",
        comment: "Comment",
        grade: 1,
        hasBeenValidated: false,
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <CommentMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByPlaceholderText("Rechercher un commentaire...")).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText("Rechercher un commentaire..."), { target: { value: "c1" } });

  screen.getAllByText('Annuler').forEach(button => {
    fireEvent.click(button);
  });

  scopeComment.done();
});

test('render CommentMonitor create modal', async () => {
  const scopeGet = nock(testUrl).get('/safeplace/comment')
    .reply(200, [], { 'Access-Control-Allow-Origin': '*' });
  const scopeCreate = nock(testUrl).post('/safeplace/comment')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <CommentMonitor />
    </Provider>
  );

  expect(screen.getByText('Créer un nouveau commentaire')).toBeInTheDocument();

  fireEvent.click(screen.getAllByRole("checkbox")[0]);
  fireEvent.change(screen.getAllByPlaceholderText("Commentaire")[0], { target: { value: "Commentaire" } });
  fireEvent.change(screen.getAllByPlaceholderText("Note")[0], { target: { value: "3" } });
  fireEvent.change(screen.getAllByPlaceholderText("ID de safeplace")[0], { target: { value: "s2" } });
  fireEvent.change(screen.getAllByPlaceholderText("ID de propriétaire")[0], { target: { value: "2" } });

  fireEvent.click(screen.getByText('Créer un commentaire'));

  await act(async () => await testDelay(1000));

  scopeCreate.done();
  scopeGet.done();
});

test('render CommentMonitor update modal', async () => {
  const comments: IComment[] = [
    {
      id: "c1",
      userId: "1",
      safeplaceId: "s1",
      comment: "Comment",
      grade: 1,
      hasBeenValidated: false,
    }
  ];

  const finalComments = comments.map(comment => ({
    ...comment,
    _id: comment.id,
  }));

  const scopeGet = nock(testUrl).get('/safeplace/comment')
    .reply(200, finalComments, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(testUrl).options('/safeplace/comment/c1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeUpdate = nock(testUrl).put('/safeplace/comment/c1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <CommentMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByTestId('uc-btn-13')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('uc-btn-13'));

  expect(screen.getByText('Modifier un commentaire')).toBeInTheDocument();

  fireEvent.click(screen.getAllByRole("checkbox")[0]);
  fireEvent.change(screen.getAllByPlaceholderText("Commentaire")[0], { target: { value: "Commentaire" } });
  fireEvent.change(screen.getAllByPlaceholderText("Note")[0], { target: { value: "3" } });
  fireEvent.change(screen.getAllByPlaceholderText("ID de safeplace")[0], { target: { value: "s2" } });
  fireEvent.change(screen.getAllByPlaceholderText("ID de propriétaire")[0], { target: { value: "2" } });

  fireEvent.click(screen.getByText('Modifier le commentaire'));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeUpdate.done();
  scopeGet.done();
});

test('render CommentMonitor delete comment', async () => {
  const comments: IComment[] = [
    {
      id: "c1",
      userId: "1",
      safeplaceId: "s1",
      comment: "Comment",
      grade: 1,
      hasBeenValidated: false,
    }
  ];

  const finalComments = comments.map(comment => ({
    ...comment,
    _id: comment.id,
  }));

  const scopeGet = nock(testUrl).get('/safeplace/comment')
    .reply(200, finalComments, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(testUrl).options('/safeplace/comment/c1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeDelete = nock(testUrl).delete('/safeplace/comment/c1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <CommentMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByTestId('dc-btn-13')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('dc-btn-13'));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeDelete.done();
  scopeGet.done();
});
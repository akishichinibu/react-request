import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';


export interface UserData {
  name: string;
  age: number;
}


export const testData: UserData[] = [
  {
    name: "a",
    age: 1,
  },
  {
    name: "b",
    age: 2,
  }
];


const delay = 1000;

const getDelayer = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Timed out');
    }, timeout);
  })
}


const server = setupServer(
  rest.get('/users', async (_, res, ctx) => {
    console.log("Should come here");
    await getDelayer(delay);
    return res(ctx.json(testData));
  }),
);


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
screen.logTestingPlaygroundURL();

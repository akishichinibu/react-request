import React, { FC } from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { delay } from 'msw/lib/types/context';

import axios from 'axios';
import { testData, UserData } from './server';
import { configUseRequest, axiosPreset, useGet } from 'src';


const a = axios.create();
configUseRequest(axiosPreset(a));


const Test: FC = () => {
  const { payload, isLoading, error } = useGet<UserData[]>({ url: "/users", });

  return (
    <div>
      <div data-testid="status">{isLoading ? "loading" : "done"}</div>
      <div data-testid="content">{JSON.stringify(payload)}</div>
      <div data-testid="error">{JSON.stringify(error)}</div>
      {!isLoading && <div data-testid="done">{JSON.stringify(error)}</div>} 
    </div>
  )
}


test('Link changes the class when hovered', async () => {
  render(<Test />);
  expect(screen.getByTestId('status').textContent).toEqual('loading');

  await waitFor(() => !screen.getByTestId('done'), {
    timeout: delay * 2,
  });

  const statusElement = screen.getByTestId("status");
  const dataElement = screen.getByTestId("content");
  const errorElement = screen.getByTestId("error");

  const data = JSON.parse(dataElement.textContent ?? "");
  expect(data).toEqual(testData);
  
  console.log(data);
  console.log(statusElement.textContent);
  console.log(errorElement.textContent);
});

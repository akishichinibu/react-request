import React, { FC } from "react";
import { render } from '@testing-library/react';

import { useGet } from "src";


const Test: FC = () => {
  const { state } = useGet<string[]>({ url: "/users", });
  return <>{state}</>
}


describe("global", () => {

  test("Error if send request without init", async () => {
    expect(() => {
      render(<Test />);
    }).toThrow();
  });

});

import { useState, useCallback } from "react";
import "react-native";
import { renderHook, act } from "@testing-library/react-hooks";
import { useFetchAddress } from "../useFetchAddress";
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

/*
This is a WIP and therefore, incomplete.
*/
test("should return 2 results", () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      status: "ok",
      balance: 9713,
      address: [
        {
          display_name: "bacon",
          lat: "38.309498",
          lon: "-85.746918",
        },
        {
          display_name: "bacon pancakes",
          lat: "41.695753",
          lon: "-86.34829",
        },
      ],
    })
  );
  const { result, rerender } = renderHook(() => useFetchAddress());
  console.log(result.current);
  act(() => {
    result.current.setSearchQuery("bacon");
  });

  expect(typeof result.current.setSearchQuery).toBe("function");
});

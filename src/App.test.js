import { render, screen } from "@testing-library/react";
import TestRenderer from 'react-test-renderer';
import App from "./App";
import { MockedProvider } from "@apollo/client/testing";
import { gql } from "@apollo/client";

const GET_ITEMS = gql`
  query getItems {
    items {
      id
      name
    }
  }
`;

const mocks = [
  {
    request: {
      query: GET_ITEMS,
    },
    result: {
      data: {
        items: [
          {
            __typename: "Item",
            id: "1",
            name: "I thought you wanted to dance",
          },
        ],
      },
    },
  },
];

it("renders loading state", () => {
  const component = TestRenderer.create(
    <MockedProvider
      mocks={mocks}
      defaultOptions={{
        watchQuery: { fetchPolicy: "no-cache" },
        query: { fetchPolicy: "no-cache" },
      }}
    >
      <App />
    </MockedProvider>
  )
  const tree = component.toJSON();
  expect(tree.children).toContain('Loading...');
});

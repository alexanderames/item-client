import "./App.css";
import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import debounce from 'debounce';

const GET_ITEMS = gql`
  query items {
    items {
      id
      name
    }
  }
`;

const CREATE_ITEM = gql`
  mutation createItem($input: CreateItemInput!) {
    createItem(input: $input) {
      item {
        id
        name
      }
    }
  }
`;

function App() {
  const [userInput, setUserInput] = useState("");
  const { loading, error, data } = useQuery(GET_ITEMS);
  const [updateItems, updateItemsStatus] = useMutation(CREATE_ITEM, {
    refetchQueries: [
      GET_ITEMS,
      'GetItems'
    ],
  });

  const onUserInput = debounce(({ target }) => {
    console.log(target.value);
    setUserInput(target.value);
  }, 250);

  const fireUserInput = () => {
    console.log(userInput);
    updateItems({
      variables: { input: { name: userInput, userId: 1 } },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error..</p>;

  return (
    <div className="container">
      <div className="row py-5">
        <div className="col-6 mx-auto w-25">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="create item"
              aria-label="create item"
              aria-describedby="button-addon2"
              onChange={onUserInput}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
              onClick={fireUserInput}
            >
              submit
            </button>
          </div>
        </div>
        <div className="col-6">
          <ul className="list-group list-group-flush">
            {data.items.map(({ id, name }) => (
              <li className="list-group-item" key={id}>
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

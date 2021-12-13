import "./App.css";
import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_ITEMS = gql`
  query items {
    items {
      id
      name
    }
  }
`;

function App() {
  const [userInput, setUserInput] = useState("");
  const { loading, error, data } = useQuery(GET_ITEMS);
  // const [updateItems, updateItemsStatus] = useMutation(GET_ITEMS);
  // TODO: update to debounce
  const onUserInput = ({ target }) => {
    console.log(target.value);
    setUserInput(target.value);
  };

  const fireUserInput = () => {
    console.log(userInput);
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
              placeholder="Recipient's username"
              aria-label="Recipient's username"
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

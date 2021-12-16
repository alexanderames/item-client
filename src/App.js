import "./App.css";
import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import debounce from 'debounce';

const GET_ITEMS = gql`
  query items {
    items {
      id
      name
      itemType
    }
  }
`;

const CREATE_ITEM = gql`
  mutation createItem($input: CreateItemInput!) {
    createItem(input: $input) {
      item {
        id
        name
        itemType
      }
    }
  }
`;

function App() {
  const [userInput, setUserInput] = useState("");
  const { loading, error, data } = useQuery(GET_ITEMS);

  const emojiMap = {
    'DRINK': '🍺',
    'TACO': '🌮',
    'SIDE': '🍕'
  }

  const itemTypes = [
    {
      label: "Taco",
      value: "TACO"
    },
    { label: "Drink", value: "DRINK" },
    { label: "Side", value: "SIDE" }
  ];

  const [collectedItemType, setItemTypes] = useState('');
  const [updateItems, updateItemsStatus] = useMutation(CREATE_ITEM, {
    refetchQueries: [GET_ITEMS, "GetItems"],
  });

  const handleTypeChange = (e) => {
    console.log('setItemTypes', e.target.value);
    setItemTypes(e.target.value);
  }
  
  const onUserInput = debounce(({ target }) => {
    console.log(target.value);
    setUserInput(target.value);
  }, 250);

  const fireUserInput = () => {
    console.log(userInput);
    console.log(collectedItemType);
    updateItems({
      variables: {
        input: { name: userInput, itemType: collectedItemType, userId: 1 },
      },
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
              placeholder="item name"
              aria-label="item name"
              aria-describedby="button-addon2"
              onChange={onUserInput}
            />
            <select onChange={handleTypeChange}>
              {itemTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
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
            {data.items.map(({ id, name, itemType }) => (
              <li className="list-group-item" key={id}>
                {name} {emojiMap[itemType]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

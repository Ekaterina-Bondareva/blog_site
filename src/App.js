import * as React from 'react';

const list = [
  {
    title: 'React',
    url: 'https://react.js.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

//definition of App component
const App = () => (
  <div>
    <h1>My Hacker Stories</h1>

    <Search />

    <hr />

    {/*creating an instance of List component */}
    <List />
    {/*creating another instance of List component */}
    <List />
  </div>
);

const Search = () => {
  const handleChange = (event) => {
    console.log(event.target.value);
  };
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} />
    </div>
  );
};

//definition of List component
const List = () => (
  <ul>
    {list.map((item) => (
      <li key={item.objectID}>
        <span>
          <a href={item.url}>{item.tetli}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
      </li>
    ))}
  </ul>
);

export default App;


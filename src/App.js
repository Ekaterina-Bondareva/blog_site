import * as React from 'react';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

//definition of App component
const App = () => {
  const stories = [
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

  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel 
        id="search" 
        label="Search" 
        value={searchTerm} 
        isFocused
        onInputChange={handleSearch} 
      >
        <strong>Search: </strong>
        </InputWithLabel>

      <hr />

      {/* creating an instance of List component */}
      <List list={searchedStories} />
    </div>
  );
};

const InputWithLabel = ({
  id, 
  value, 
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => (
  <>
    <label htmlFor={id}>{children}</label>
    &nbsp;
    <input 
      id={id} 
      type={type} 
      value={value}
      autoFocus={isFocused}
      onChange={onInputChange} 
    />
  </>
);


//definition of List component
const List = ({list}) => (
  <ul>
    {list.map(({objectID, ...item}) => (
      <Item key={objectID} {...item} />
    ))}
  </ul>
);

const Item = ({title, url, author, num_comments, points}) => (
  <li>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </li>
);

export default App;


import * as React from 'react';
import axios from 'axios';

import './App.css';
import { ReactComponent as Check } from './check.svg';
import { type } from '@testing-library/user-event/dist/type';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type Stories = Array<Story>;

const useSemiPersistentState = (
    key: string, 
    initialState: string
) : [string, (newValue: string) => void] => {
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

interface StoriesFetchInitAction {
  type: 'STORIES_FETCH_INIT';
}

interface StoriesFetchSuccessAction {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Stories;
}

interface StoriesFetchFailureAction {
  type: 'STORIES_FETCH_FAILURE';
}

interface StoriesRemoveAction {
  type: 'REMOVE_STORY';
  payload: Story;
}

type StoriesAction = 
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;

const storiesReducer = (
  state: StoriesState,
  action: StoriesAction
) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}: SearchFormProps) => (
  <form onSubmit={onSearchSubmit} className='search-form'>
    <InputWithLabel
      id='search'
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search: </strong>
    </InputWithLabel>

    <button 
      type='submit' 
      disabled={!searchTerm}
      className='button button_large'
    >
      Submit
    </button>
  </form>
);

const getSumComments = (stories: {data: Stories, isLoading: boolean, isError: boolean}) => {
  return stories.data.reduce(
    (result, value) => result + value.num_comments,
    0
  );
}

//definition of App component
const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    {data: [], isLoading: false, isError: false}
  );

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({type: 'STORIES_FETCH_INIT'});

    try {
      const result = await axios.get(url);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories( {type: 'STORIES_FETCH_FAILURE'});
    }
    }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory= (item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearchInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  const sumComments = React.useMemo(() => getSumComments(stories), [
    stories,
  ]);

  return (
    <div className='container'>
      <h1 className='headline-primary'>My Hacker Stories with {sumComments} comments.</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        /* creating an instance of List component */
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: React.ReactNode;
};

const InputWithLabel = ({
  id, 
  value, 
  type = "text",
  onInputChange,
  isFocused,
  children,
}: InputWithLabelProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id} className='label'>
        {children}
      </label>
      &nbsp;
      <input 
        ref={inputRef}
        id={id} 
        type={type} 
        value={value}
        onChange={onInputChange} 
        className='input'
      />
    </>
  );
};

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

//definition of List component
const List = React.memo(
({list, onRemoveItem}: ListProps) => (
  (
    <ul>
      {list.map((item) => (
        <Item 
          key={item.objectID}
          item={item} 
          onRemoveItem={onRemoveItem}
        />
      ))}
    </ul>
  )
));

type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

const Item = ({item, onRemoveItem}: ItemProps) => (
  <li className='item'>
    <span style={{width: '40%'}}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{width: '30%'}}>{item.author}</span>
    <span style={{width: '10%'}}>{item.num_comments}</span>
    <span style={{width: '10%'}}>{item.points}</span>
    <span style={{width: '10%'}}>
      <button 
        type="button" 
        onClick={() => onRemoveItem(item)}
        className='button button_small'
      >
        <Check height='18px' width='18px' />
      </button>
    </span>
  </li>
);

export default App;

export {storiesReducer, SearchForm, InputWithLabel, List, Item};
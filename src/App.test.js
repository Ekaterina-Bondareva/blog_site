import * as React from 'react';

import App, {
  storiesReducer, 
  SearchForm, 
  InputWithLabel, 
  List, 
  Item
} from './App';


const storyOne = {
  title: 'React',
  url: 'https://react.js.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {
  test('removes a story from all stories', () => {
    const action = {type: 'REMOVE_STORY', payload: storyOne};// TODO: some action
    const state = {data: stories, isLoading: false, isError: false};//TODO: some current state

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };//TODO: the expected state

    expect(newState).toStrictEqual(expectedState);
  });
});


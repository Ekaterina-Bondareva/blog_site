import * as React from 'react';

import { ReactComponent as Check } from './check.svg';


type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type Stories = Array<Story>;

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


export {List};
export type {Story, Stories};
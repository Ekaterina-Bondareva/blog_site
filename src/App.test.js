import { render, screen } from '@testing-library/react';
import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

describe('something truthy and falsy', () => {
  it('true to be true', () => {
    expect(true).toBeTruthy();
  });

  it('false to be false', () => {
    expect(false).toBeFalsy();
  })
});

describe('App component', () => {
  test('removes an item when clicking the Dismiss button', () => {

  });

  test('requests some initial stories from an API', () => {

  });
});
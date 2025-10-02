import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../views/HomePage';

test('renders NoteShare brand in navbar', () => {
  const router = createMemoryRouter(
    [{ path: '/', element: <App />, children: [{ path: '/', element: <HomePage /> }] }],
    { initialEntries: ['/'] }
  );
  render(<RouterProvider router={router} />);
  expect(screen.getByText(/NoteShare/i)).toBeInTheDocument();
});

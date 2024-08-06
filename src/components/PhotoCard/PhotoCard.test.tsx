import React from 'react';
import { render, screen } from '@testing-library/react';
import PhotoCard from './PhotoCard';

const photo = {
  id: '1',
  server: '1234',
  secret: 'abcd',
  title: 'Test Photo',
};

test('renders PhotoCard component', () => {
  render(<PhotoCard photo={photo} onFavorite={() => {}} isFavorite={false} />);
  expect(screen.getByText(/Test Photo/i)).toBeInTheDocument();
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import Gallery from './Gallery';

test('renders Gallery component', () => {
  render(<Gallery searchQuery="" />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

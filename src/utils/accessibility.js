import ReactDOM from 'react-dom';
import axe from '@axe-core/react';

export const runAccessibilityChecks = () => {
  if (process.env.NODE_ENV !== 'production') {
    axe(React, ReactDOM, 1000);
  }
};
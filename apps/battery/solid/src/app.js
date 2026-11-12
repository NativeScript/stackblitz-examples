import { Application } from '@nativescript/core';
import { render } from '@nativescript-community/solid-js';
import { Home } from './components/home.jsx';

document.body.actionBarHidden = false;

Application.run({
  create: () => {
    render(Home, document.body);
    return document;
  },
});

import React, { Component } from 'react';

import Container from './Container';

class App extends Component {
  constructor(props) {
    super(props);

    const doc = this._createSeparateDocument();

    this._mutationObserver = new MutationObserver(this._handleMutation.bind(this));
    this._mutationObserver.observe(doc.firstElementChild, {
      attributes: true,
      childList: true,
      subtree: true
    });

    this._doc = doc;

    this.state = {
      counter: 0,
      queryString: '',
      matchingElements: [],
    };
  }

  render() {
    return <div className="app">
      <label>
        Enter a CSS selector to see what elements are matched:

        <input
          value={this.state.queryString}
          onChange={this._updateQueryString.bind(this)}
        />
      </label>

      <Container
        node={this._doc.firstElementChild}
        doc={this._doc}
        children={Array.from(this._doc.firstElementChild.children)}
        matchingElements={this.state.matchingElements}
      />
    </div>;
  }

  _createSeparateDocument() {
    return new DOMParser().parseFromString('<div></div>', 'text/html');
  }

  _handleMutation(mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type == 'childList') {
        this.setState((state) => {
          return { counter: state.counter + 1 };
        });
      } else if (mutation.type == 'attributes') {
        this.setState((state) => {
          return { counter: state.counter + 1 };
        });
      }

      this.setState({
        matchingElements: this._getMatchingElements(this.state.queryString),
      });
    }
  }

  _updateQueryString(ev) {
    const value = ev.target.value;
    this.setState({
      queryString: value,
      matchingElements: this._getMatchingElements(value),
    });
  }

  _getMatchingElements(queryString) {
    if (!queryString) {
      return [];
    } else {
      try {
        return Array.from(this._doc.querySelectorAll(queryString)); 
      } catch (e) {
        // Not a matching selector
        return [];
      }
    }
  }
}

export default App;

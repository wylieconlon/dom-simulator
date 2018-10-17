import React, { Component } from 'react';

const NO_VALUE = 'None given';

class Container extends Component {
  render() {
    const node = this.props.node;

    const isMatching = this.props.matchingElements.includes(this.props.node);

    return <div className={`container ${isMatching ? 'is-matching' : ''}`}>
      <div>
        <strong>{node.nodeName.toLowerCase()}</strong>
        &nbsp;
        <label>
          class="<input
            value={node.className}
            onChange={this.updateClassName.bind(this)}
          />"
        </label>
        &nbsp;
        <label>
          id="<input
            value={node.id}
            onChange={this.updateNodeId.bind(this)}
          />"
        </label>
      </div>

      {node.nodeName !== 'HTML' &&
        <button onClick={this.handleRemove.bind(this)}>
          Remove this element and all children
        </button>
      }

      <button onClick={this.handleAppend.bind(this)}>
        Append: Add a new element as the last child of this element
      </button>

      <button onClick={this.handleClear.bind(this)}>
        Set innerHTML to ''
      </button>

      {Array.from(this.props.children).map((node, index) => {
        return <Container
          node={node}
          doc={this.props.doc}
          key={index}
          children={Array.from(node.children)}
          matchingElements={this.props.matchingElements}
        />;
      })}
    </div>;
  }

  handleAppend() {
    this.props.node.appendChild(this.props.doc.createElement('div'));
  }

  handleClear() {
    this.props.node.innerHTML = '';
  }

  handleRemove() {
    this.props.node.remove();
  }

  updateClassName(ev) {
    this.props.node.className = ev.target.value;
  }

  // updateNodeName(ev) {
  //   this.props.node.nodeName = ev.target.value;
  // }

  updateNodeId(ev) {
    this.props.node.id = ev.target.value;
  }
}

export default Container;
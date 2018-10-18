import React, { Component } from 'react';

const NO_VALUE = 'None given';

class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      attributeString: '',
      nodeNameString: '',
      hasValidAttributes: true,
    };
  }

  componentDidMount() {
    const node = this.props.node;
    this.setState({
      nodeNameString: node.nodeName.toLowerCase(),
      attributeString: this._getOtherAttributes(),
    });
  }

  render() {
    const node = this.props.node;

    const isMatching = this.props.matchingElements.includes(this.props.node);

    return <div className={`container ${isMatching ? 'is-matching' : ''}`}>
      <div className="inputs">
        {this.isReadOnlyNodeName() ?
          <strong>{this.state.nodeNameString}</strong> :
          <input
            className="input-nodeName"
            value={this.state.nodeNameString}
            onChange={this.updateNodeName.bind(this)}
            readOnly={this.isReadOnlyNodeName()}
          />
        }
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
        &nbsp;
        <input
          className={`input-attributes ${this.state.hasValidAttributes ? '' : 'is-invalid'}`}
          value={this.state.attributeString}
          onChange={this._handleOtherAttributeChange.bind(this)}
          placeholder='Other attributes, like title="Hover text"'
        />
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

  _getOtherAttributes() {
    const attributes = this.props.node.attributes;
    if (attributes.length > 0) {
      let filteredAttributes = Array.from(attributes).filter((attribute) => {
        return attribute.name !== 'class' && attribute.name !== 'id';
      });
      return filteredAttributes.map((attribute) => {
        return `${attribute.name}="${attribute.value}"`;
      }).join(' ');
    }
    return '';
  }

  _handleOtherAttributeChange(ev) {
    this.setState({
      attributeString: ev.target.value
    });

    const nodeName = this.props.node.nodeName;
    const attributeStr = ev.target.value;

    let fakeElement;
    try {
      fakeElement = this.props.doc.createElement('div');
      fakeElement.innerHTML = `<${nodeName} ${attributeStr}></${nodeName}>`;
      if (!fakeElement.firstChild) {
        this.setState({
          hasValidAttributes: false,
        });
        return;
      } else {
        this.setState({
          hasValidAttributes: true,
        });
      }
    } catch (e) {
      console.error(e);
      debugger;
    }

    const attributes = fakeElement.firstChild.attributes;
    if (attributes.length > 0) {
      let filteredAttributes = Array.from(attributes).filter((attribute) => {
        return attribute.name !== 'class' && attribute.name !== 'id';
      });

      filteredAttributes.forEach((attribute) => {
        this.props.node.setAttributeNode(attribute.cloneNode(true));
      });
    }
  }

  isReadOnlyNodeName() {
    const name = this.props.node.nodeName;
    return name === 'HTML' || name === 'HEAD' || name === 'BODY';
  }

  updateNodeName(ev) {
    if (this.isReadOnlyNodeName()) {
      return;
    }

    const newNodeName = ev.target.value.toUpperCase();

    if (newNodeName) {
      const currentNode = this.props.node;
      const innerHTML = currentNode.innerHTML;
      const outerHTML = `<${newNodeName}
        class="${currentNode.className}"
        id="${currentNode.id}"
        ${this._getOtherAttributes()}>${innerHTML}</${newNodeName}>
      `;

      currentNode.outerHTML = outerHTML;
      this.setState({
        nodeNameString: newNodeName.toLowerCase()
      });
    }
  }

  updateNodeId(ev) {
    this.props.node.id = ev.target.value;
  }
}

export default Container;
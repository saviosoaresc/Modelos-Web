const ee = new EventEmitter();
const App = React.createClass({ displayName: "App",
  render() {
    return /*#__PURE__*/(
      React.createElement("main", { className: "react-calculator" }, /*#__PURE__*/
      React.createElement(InputField, null), /*#__PURE__*/
      React.createElement(TotalRecall, null), /*#__PURE__*/
      React.createElement(ButtonSetNumbers, null), /*#__PURE__*/
      React.createElement(ButtonSetFunctions, null), /*#__PURE__*/
      React.createElement(ButtonSetEquations, null)));


  } });

const Button = React.createClass({ displayName: "Button",
  _handleClick() {
    let text = this.props.text,
    cb = this.props.clickHandler;

    if (cb) {
      cb.call(null, text);
    }
  },

  render() {
    return /*#__PURE__*/(
      React.createElement("button", { className: this.props.klass, onClick: this._handleClick }, /*#__PURE__*/
      React.createElement("span", { className: "title" }, this.props.text)));


  } });

const ContentEditable = React.createClass({ displayName: "ContentEditable",
  _handleClick() {
    const cb = this.props.clickHandler;

    if (cb) {
      cb.call(this);
    }
  },

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "editable-field", contentEditable: this.props.initEdit, spellcheck: this.props.spellCheck, onClick: this._handleClick },
      this.props.text));


  } });


const InputField = React.createClass({ displayName: "InputField",
  _updateField(newStr) {
    newStr = newStr.split ? newStr.split(' ').reverse().join(' ') : newStr;
    return this.setState({ text: newStr });
  },

  getInitialState() {
    this.props.text = this.props.text || '0';

    return { text: this.props.text };
  },

  componentWillMount() {
    ee.addListener('numberCruncher', this._updateField);
  },

  render() {
    return /*#__PURE__*/React.createElement(ContentEditable, { text: this.state.text, initEdit: "false", spellcheck: "false", clickHandler: this._clickBait });
  } });

const TotalRecall = React.createClass({ displayName: "TotalRecall",
  _toggleMemories() {
    this.setState({ show: !this.state.show });
  },

  _recallMemory(memory) {
    store.newInput = memory;
    ee.emitEvent('toggle-memories');
  },

  getInitialState() {
    return { show: false };
  },

  componentWillMount() {
    ee.addListener('toggle-memories', this._toggleMemories);
  },

  render() {
    let classNames = `memory-bank ${this.state.show ? 'visible' : ''}`;

    return /*#__PURE__*/(
      React.createElement("section", { className: classNames }, /*#__PURE__*/
      React.createElement(Button, { text: "+", clickHandler: this._toggleMemories, klass: "toggle-close" }),
      store.curMemories.map(mem => {
        return /*#__PURE__*/(
          React.createElement(Button, { klass: "block memory transparent", text: mem, clickHandler: this._recallMemory }));

      })));


  } });

const ButtonSetFunctions = React.createClass({ displayName: "ButtonSetFunctions",
  _showMemoryBank() {
    ee.emitEvent('toggle-memories');
  },

  _clear() {
    store.newInput = 0;
  },

  _contentClear() {
    let curInput = String(store.curInput),
    lessOne = curInput.substring(0, curInput.length - 1);

    return store.newInput = lessOne === '' ? 0 : lessOne;
  },

  render() {
    return /*#__PURE__*/(
      React.createElement("section", { className: "button-set--functions" }, /*#__PURE__*/
      React.createElement(Button, { klass: "long-text", text: "recall", clickHandler: this._showMemoryBank }), /*#__PURE__*/
      React.createElement(Button, { klass: "long-text", text: "clear", clickHandler: this._clear }), /*#__PURE__*/
      React.createElement(Button, { text: "\u2190", clickHandler: this._contentClear })));


  } });

const ButtonSetEquations = React.createClass({ displayName: "ButtonSetEquations",
  _eq(type) {
    store.newInput = `${store.curInput} ${type} `;
  },

  _equate() {
    store.newInput = eval(store.curInput);
  },

  render() {
    return /*#__PURE__*/(
      React.createElement("section", { className: "button-set--equations" }, /*#__PURE__*/
      React.createElement(Button, { text: "+", clickHandler: this._eq }), /*#__PURE__*/
      React.createElement(Button, { text: "-", clickHandler: this._eq }), /*#__PURE__*/
      React.createElement(Button, { text: "*", clickHandler: this._eq }), /*#__PURE__*/
      React.createElement(Button, { text: "/", clickHandler: this._eq }), /*#__PURE__*/
      React.createElement(Button, { text: "=", clickHandler: this._equate })));


  } });

const ButtonSetNumbers = React.createClass({ displayName: "ButtonSetNumbers",
  _number(num) {
    if (!store.curInput) {
      return store.newInput = num;
    }

    return store.newInput = `${store.curInput}${num}`;
  },

  render() {
    return /*#__PURE__*/(
      React.createElement("section", { className: "button-set--numbers" }, /*#__PURE__*/
      React.createElement(Button, { text: "1", clickHandler: this._number }), /*#__PURE__*/
      React.createElement(Button, { text: "2", clickHandler: this._number }), /*#__PURE__*/
      React.createElement(Button, { text: "3", clickHandler: this._number }), /*#__PURE__*/
      React.createElement(Button, { text: "4", clickHandler: this._number }), /*#__PURE__*/
      React.createElement(Button, { text: "5", clickHandler: this._number }), /*#__PURE__*/
      React.createElement(Button, { text: "6", clickHandler: this._number }), /*#__PURE__*/
      React.createElement(Button, { text: "7", clickHandler: this._number }), /*#__PURE__*/
      React.createElement(Button, { text: "8", clickHandler: this._number }), /*#__PURE__*/
      React.createElement(Button, { text: "9", clickHandler: this._number }), /*#__PURE__*/
      React.createElement(Button, { text: "0", clickHandler: this._number })));


  } });


let store = {
  input: 0,
  memory: [],
  get curInput() {
    return this.input;
  },

  get curMemories() {
    return this.memory.filter(m => m !== undefined);
  },

  set commitMemory(input) {
    this.memory.push(input);
  },

  set newInput(str) {
    let curInput = str,
    oldInput = this.curInput;

    if (this.curMemories.indexOf(oldInput) === -1) {
      this.commitMemory = oldInput;
    }

    this.input = curInput;
    ee.emitEvent('numberCruncher', [this.curInput]);
  } };


React.render( /*#__PURE__*/
React.createElement(App, null),
document.querySelector('body'));
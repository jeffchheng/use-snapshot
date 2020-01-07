const React = require('react');
const { useState } = require('react');
const { render, fireEvent } = require('@testing-library/react');

const {
  SnapshotProvider,
  useSnapshot,
  useStateSnapshot,
} = require('.');

function State() {
  const state = useStateSnapshot();
  return <div>Stringified State: {JSON.stringify(state)}</div>;
}

function Foo() {
  useSnapshot("Foo", "Foo", true);
  return <div>Foo will snapshot</div>;
}

function Bar() {
  useSnapshot("Bar", "Bar", true);
  return <div>Bar will snapshot</div>;
}

function Baz() {
  useSnapshot("Baz", "Baz", false);
  return <div>Baz will not snapshot</div>;
}

function Form() {
  const [input, setInput] = useState("");
  useSnapshot("input", input, !!input);
  return (
    <>
      <div>This form will snapshot:</div>
      <div>
        <label htmlFor="text-input">Input: </label>
        <input
          id="text-input"
          aria-label="text-input"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>
    </>
  );
}

function DynamicKey() {
  const [key, setKey] = useState(1);
  useSnapshot(`DynamicKey-${key}`, 'StaticValue', true);
  return (
    <>
      <div>
        DynamicKey will snapshot
        <button onClick={() => setKey(x => x + 1)}>Increment Key</button>
      </div>
    </>
  );
}

function DynamicShouldSave() {
  const [shouldSave, setShouldSave] = useState(true);
  useSnapshot('DynamicShouldSave', null, shouldSave);
  return (
    <div>
      DynamicShouldSave shouldSave={String(shouldSave)}
      <button onClick={() => setShouldSave(x => !x)}>Toggle Should Save</button>
    </div>
  );
}

function App() {
  const [showState, setShowState] = useState(false);
  return (
    <SnapshotProvider>
      <Foo />
      <Bar />
      <Baz />
      <Form />
      <DynamicKey />
      <DynamicShouldSave />
      <button onClick={() => setShowState(state => !state)}>Snapshot</button>
      {showState && <State />}
    </SnapshotProvider>
  );
}

describe('use-snapshot', () => {
  let ogConsoleError;

  beforeEach(() => {
    ogConsoleError = console.error;
    console.error = () => null;
  });

  afterEach(() => {
    console.error = ogConsoleError;
  });

  it('can snapshot state with useSnapshot and provide it via useStateSnapshot', () => {
    const { container, getByText } = render(<App />);
    fireEvent.click(getByText('Snapshot'));
    expect(getByText(/Stringified State/i)).toMatchSnapshot();
  });

  it('handles dynamic updates to keys by removing the previous key from state', () => {
    const { container, getByText } = render(<App />);
    fireEvent.click(getByText('Snapshot'));
    expect(getByText(/Stringified State/i)).toMatchSnapshot();
    fireEvent.click(getByText('Increment Key'));
    expect(getByText(/Stringified State/i)).toMatchSnapshot();
    fireEvent.click(getByText('Increment Key'));
    expect(getByText(/Stringified State/i)).toMatchSnapshot();
  });

  it('handles dynamic updates to shouldSave by removing or adding to state', () => {
    const { container, getByText } = render(<App />);
    fireEvent.click(getByText('Snapshot'));
    expect(getByText(/Stringified State/i)).toMatchSnapshot();
    fireEvent.click(getByText('Toggle Should Save'));
    expect(getByText(/Stringified State/i)).toMatchSnapshot();
    fireEvent.click(getByText('Toggle Should Save'));
    expect(getByText(/Stringified State/i)).toMatchSnapshot();
    fireEvent.click(getByText('Toggle Should Save'));
    expect(getByText(/Stringified State/i)).toMatchSnapshot();
  });

  it('updates state values when they change', () => {
    const { container, getByText, getByLabelText } = render(<App />);
    fireEvent.click(getByText('Snapshot'));
    expect(getByText(/Stringified State/i)).toMatchSnapshot();
    fireEvent.change(getByLabelText('text-input'), { target: { value: 'whatevs' } });
    expect(getByText(/Stringified State/i)).toMatchSnapshot();
    fireEvent.change(getByLabelText('text-input'), { target: { value: '' } });
    expect(getByText(/Stringified State/i)).toMatchSnapshot();
  });

  it('useSnapshot throws when rendered outside of SnapshotProvider', () => {
    expect(() => render(<Foo />)).toThrow();
  });

  it('useStateSnapshot throws when rendered outside of SnapshotProvider', () => {
    expect(() => render(<State />)).toThrow();
  });
});

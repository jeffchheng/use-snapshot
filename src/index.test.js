import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';

import {
  SnapshotProvider,
  useSnapshot,
  useStateSnapshot,
} from '.';

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

function App() {
  const [showState, setShowState] = useState(false);
  return (
    <SnapshotProvider>
      <Foo />
      <Bar />
      <Baz />
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
    const { container, getByText, rerender } = render(<App />);
    fireEvent.click(getByText('Snapshot'));
    expect(getByText(/Stringified State/i)).toMatchSnapshot();
  });

  it('useSnapshot throws when rendered outside of SnapshotProvider', () => {
    expect(() => render(<Foo />)).toThrow();
  });

  it('useStateSnapshot throws when rendered outside of SnapshotProvider', () => {
    expect(() => render(<State />)).toThrow();
  });
});

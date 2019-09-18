import React, {
  useState,
  useReducer,
  useEffect,
  useContext
} from 'react';

const SnapshotDispatch = React.createContext();
const StateSnapshot = React.createContext();
const ShouldSnapshot = React.createContext();
const SetShouldSnapshot = React.createContext();

const initialState = {};

function reducer(state, { type, key, value }) {
  switch (type) {
    case 'save': return { ...state, [key]: value };
    case 'reset': return initialState;
    default: throw new Error();
  }
}

export function SnapshotProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [shouldSnapshot, setShouldSnapshot] = useState(false);

  return (
    <SnapshotDispatch.Provider value={ dispatch }>
      <SetShouldSnapshot.Provider value={ setShouldSnapshot }>
        <ShouldSnapshot.Provider value={ shouldSnapshot }>
          <StateSnapshot.Provider value={ state }>
            { children }
          </StateSnapshot.Provider>
        </ShouldSnapshot.Provider>
      </SetShouldSnapshot.Provider>
    </SnapshotDispatch.Provider>
  );
}

export function useSnapshot(key, value, shouldSave = true) {
  const dispatch = useContext(SnapshotDispatch);
  const shouldSnapshot = useContext(ShouldSnapshot);

  if (dispatch === undefined) {
    throw new Error('useSnapshot must be used within a SnapshotProvider');
  }

  useEffect(() => {
    if (shouldSnapshot && shouldSave && key && value) {
      dispatch({ type: 'save', key, value });
    }
  }, [key, value, shouldSave, shouldSnapshot, dispatch]);

  return null;
}

export function useStateSnapshot() {
  const dispatch = useContext(SnapshotDispatch);
  const state = useContext(StateSnapshot);
  const setShouldSnapshot = useContext(SetShouldSnapshot);

  useEffect(() => {
    setShouldSnapshot(true);

    return () => {
      dispatch({ type: 'reset' });
      setShouldSnapshot(false);
    }
  }, [dispatch, setShouldSnapshot]);

  if (dispatch === undefined) {
    throw new Error('useStateSnapshot must be used within a SnapshotProvider');
  }

  return state;
}

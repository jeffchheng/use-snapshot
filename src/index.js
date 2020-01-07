const React = require('react');

const {
  useRef,
  useState,
  useReducer,
  useEffect,
  useContext
} = require('react');

const SnapshotDispatch = React.createContext();
const StateSnapshot = React.createContext();
const ShouldSnapshot = React.createContext();
const SetShouldSnapshot = React.createContext();

const initialState = {};

function reducer(state, action) {
  switch (action.type) {
    case 'save': return { ...state, [action.key]: action.value };
    case 'remove': {
      if (!state.hasOwnProperty(action.key)) {
        return state;
      }
      const nextState = { ...state };
      delete nextState[action.key];
      return nextState;
    }
    case 'reset': return initialState;
    default: throw new Error();
  }
}

function SnapshotProvider({ children }) {
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

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function useSnapshot(key, value, shouldSave = true) {
  const prevKey = usePrevious(key);
  const dispatch = useContext(SnapshotDispatch);
  const shouldSnapshot = useContext(ShouldSnapshot);

  useEffect(() => {
    if (shouldSnapshot && prevKey !== key) {
      dispatch({ type: 'remove', key: prevKey });
    }
  }, [prevKey, key, value, shouldSnapshot, dispatch]);

  useEffect(() => {
    if (shouldSnapshot) {
      if (shouldSave && key) {
        dispatch({ type: 'save', key, value });
      } else if (key) {
        dispatch({ type: 'remove', key });
      }
    }
  }, [key, value, shouldSave, shouldSnapshot, dispatch]);

  if (dispatch === undefined) {
    throw new Error('useSnapshot must be used within a SnapshotProvider');
  }

  return null;
}

function useStateSnapshot() {
  const dispatch = useContext(SnapshotDispatch);
  const state = useContext(StateSnapshot);
  const setShouldSnapshot = useContext(SetShouldSnapshot);

  useEffect(() => {
    if (setShouldSnapshot) {
      setShouldSnapshot(true);
    }

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

module.exports = {
  SnapshotProvider,
  useSnapshot,
  useStateSnapshot,
};

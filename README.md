# use-snapshot &middot; ![Node CI](https://github.com/jeffchheng/use-snapshot/workflows/Node%20CI/badge.svg)

Snapshot any value in a component's render and save it in one place for sending in crash logs and the like.

## Installation

Requires React >= 16.8 for hooks.

With npm:
```
npm install --save use-snapshot
```

With yarn:
```
yarn add use-snapshot
```

## Usage

[Demo on Code Sandbox.](https://codesandbox.io/embed/use-snapshot-demo-v3eje)

Wrap your app or a sub-tree within the SnapshotProvider.

```javascript
// ...
import { SnapshotProvider } from "use-snapshot";

function App() {
  return (
    <SnapshotProvider>
      <RestOfYourApp />
    </SnapshotProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

Snapshot any truthy values in any components render with `useSnapshot(key: string, value: any, shouldSave: bool)`.

```javascript
import React, { useEffect } from "react";
import { useSnapshot } from "use-snapshot":

function UsernameDisplay({ id }) {
  const [name, setName] = useState('');
  const [error, setError] = useState();

  // fetch user and display their name
  useEffect(() => {
    let shouldRun = true;
    fetch(`/api/v1/users/${id}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("uh-oh");
      })
      .then(res => shouldRun && setName(res.name))
      .catch(res => shouldRun && setError(res));)
    return () => {
      shouldRun = false;
    }
  }, [id]);

  // capture any API errors
  useSnapshot(`UsernameDisplay User/${id}`, error, !!error);
  
  return (
    <div className="username-display">{name || '-----'}</div>
  );
}
```

When you want to retrieve the data to send in a crash report, you can render a component (like a report a problem form) that implements `const state = useStateSnapshot();`. `state` will contain all the key-value pairs you've specified with `useSnapshot`.

```javascript
import React, { useEffect } from "react";
import { useStateSnapshot } from "use-snapshot":

function ReportAProblemForm() {
  const state = useStateSnapshot();

  return <YourForm state={state} />;
}
```

## Why would I use this?

[Blog on why I made this.](https://jeffchheng.github.io/brains-base/2019-06-12-data-fetching-with-hooks/)

TL;DR: If you want to capture API errors, invalid form state, response bodies, or really any value available in render with pure React, this is the library for you. One of the selling points of Redux is global state that can be serialized and sent in debug logs and crash reports. But Redux can feel heavy-handed, so I wanted a way to do the same with pure React.

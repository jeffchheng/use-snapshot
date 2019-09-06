# use-snapshot

This library provides two custom hooks and a provider component that allows for snapshotting any value in a component's render phase and saving it to state for crash logs and the like.

To use, simply wrap a sub-tree or the entire component tree with `SnapshotProvider`.

Then, you are free to save values with `useSnapshot(key: string, value: any, shouldSave: bool)`.

When you want to retrieve the data to send in a crash report, you can render a component (like a report a problem form) that implements `const state = useStateSnapshot();`. `state` will contain all the key-value pairs you've specified with `useSnapshot`.

[Demo on Code Sandbox](https://codesandbox.io/embed/use-snapshot-demo-v3eje)

[Blog on why I made this](https://jeffchheng.github.io/brains-base/2019-06-12-data-fetching-with-hooks/)

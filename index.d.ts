type SnapshotProviderProps = {
  children?: any;
}

declare function SnapshotProvider(props: SnapshotProviderProps): JSX.Element

declare function useSnapshot(key: string, value: any, shouldSave?: boolean): void

declare function useStateSnapshot(): object

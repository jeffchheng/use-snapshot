type PropsWithChildren = {
  children?: any;
}

declare module "use-snapshot" {
  function SnapshotProvider(props: PropsWithChildren): JSX.Element
  
  function useSnapshot(key: string, value: any, shouldSave?: boolean): void
  
  function useStateSnapshot(): object
}

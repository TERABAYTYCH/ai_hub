
    export type RemoteKeys = 'hub/Settings';
    type PackageType<T> = T extends 'hub/Settings' ? typeof import('hub/Settings') :any;
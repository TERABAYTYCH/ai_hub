
    export type RemoteKeys = 'pulse/Settings';
    type PackageType<T> = T extends 'pulse/Settings' ? typeof import('pulse/Settings') :any;

    export type RemoteKeys = 'control/Dashboard' | 'control/Devices' | 'control/Settings';
    type PackageType<T> = T extends 'control/Settings' ? typeof import('control/Settings') :T extends 'control/Devices' ? typeof import('control/Devices') :T extends 'control/Dashboard' ? typeof import('control/Dashboard') :any;
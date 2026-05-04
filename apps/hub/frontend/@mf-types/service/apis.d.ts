
    export type RemoteKeys = 'service/Dashboard' | 'service/Devices' | 'service/Settings';
    type PackageType<T> = T extends 'service/Settings' ? typeof import('service/Settings') :T extends 'service/Devices' ? typeof import('service/Devices') :T extends 'service/Dashboard' ? typeof import('service/Dashboard') :any;
declare module 'virtual:__federation__' {
  export const __federation_method_setRemote: (
    remoteName: string,
    options: {
      url: () => Promise<string>;
      from: string;
      format: string;
    },
  ) => void;
  export const __federation_method_ensure: (remoteName: string) => Promise<void>;
  export const __federation_method_getRemote: (
    remoteName: string,
    modulePath: string,
  ) => Promise<unknown>;
}

export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  module?: string;
}

export interface MicroserviceManifest {
  serviceId: string;
  name: string;
  baseUrl: string;
  navigation: NavigationItem[];
}

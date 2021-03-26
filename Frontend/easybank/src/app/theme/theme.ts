export interface Theme {
    name: string;
    properties: any;
}

export const light: Theme = {
    name: "light",
    properties: {
      "--dashboard-main": "#0088c7",
      "--dashboard-sidebar": "#0088c7",
      "--dashboard-background":"#f7f7f7",
      "--dashboard-text": "#070707",
      "--dashboard-card": "#ffffff",
      "--dashboard-tablehead":"#dddddd",
      "--dashboard-header": "#ffffff",
      "--dashboard-header-sep": "#d6d6d6f1"
    }
  };

  export const dark: Theme = {
    name: "dark",
    properties: {
        "--dashboard-main": "#0088c7",
        "--dashboard-sidebar": "#1d2231",
        "--dashboard-background":"#111111",
        "--dashboard-text": "#e7e7e7",
        "--dashboard-card": "#0f0f0f",
        "--dashboard-tablehead":"#0c0c0c",
        "--dashboard-header": "#0c0c0c",
        "--dashboard-header-sep": "#000000f1"
    }
  };


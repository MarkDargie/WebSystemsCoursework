export interface Theme {
    name: string;
    properties: any;
}

export const light: Theme = {
    name: "light",
    properties: {
      "--dashboard-main": "#0088c7",
      "--dashboard-sidebar": "#0088c7"
    }
  };

  export const dark: Theme = {
    name: "dark",
    properties: {
        "--dashboard-main": "#0088c7",
        "--dashboard-sidebar": "#1d2231"
    }
  };


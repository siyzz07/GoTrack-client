
const TOKEN_KEY = "access_token";

export const sessionService = {
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
  clear: () => {
    localStorage.clear();
  }
};

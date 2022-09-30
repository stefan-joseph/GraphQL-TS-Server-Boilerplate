const rp = require("request-promise");

export class TestClient {
  url: string;
  options: {
    jar: any;
    withCredentials: boolean;
    json: boolean;
  };
  constructor(endpoint: string) {
    this.url = (process.env.TEST_HOST as string) + endpoint;
    this.options = {
      withCredentials: true,
      jar: rp.jar(),
      json: true,
    };
  }

  async register(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
          mutation {
            register (email: "${email}", password: "${password}") {
              path
              message
            } 
          }
        `,
      },
    });
  }

  async login(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
          mutation {
            login(email: "${email}", password: "${password}") {
              path
              message
            }
          }
        `,
      },
    });
  }

  async logout() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
          mutation {
            logout 
          }
        `,
      },
    });
  }

  async changeForgottenPassword(newPassword: string, key: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
          mutation {
            changeForgottenPassword(newPassword: "${newPassword}", key: "${key}") {
              path
              message
            }
          }
        `,
      },
    });
  }

  async me() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
          {
            me {
              id
              email
            }
          }
        `,
      },
    });
  }
}

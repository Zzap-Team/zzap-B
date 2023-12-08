export interface EnvironmentVariables {
  auth: {
    access: {
      expiresIn: string;
    };
    refresh: {
      expiresIn: string;
    };
    jwt: {
      secret: string;
    };
  };
  thirdParty: {
    github: {
      clientId: string;
      clientSecret: string;
    };
  };
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
}

export const configuration = (): EnvironmentVariables => ({
  auth: {
    access: {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '2h',
    },
    refresh: {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '1d',
    },
    jwt: {
      secret: process.env.JWT_TOKEN_SECRET as string,
    },
  },
  thirdParty: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || 'Please set this value.',
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET || 'Please set this value.',
    },
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '10', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Please set this value.',
    database: process.env.DB_DATABASE || 'zzap',
  },
});

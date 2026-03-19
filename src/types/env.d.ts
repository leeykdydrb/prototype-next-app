declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    NEXT_PUBLIC_BACKEND_URL: string;
    NEXT_PUBLIC_KEYCLOAK_ISSUER?: string;
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID?: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    INTERNAL_NEXTAUTH_URL: string;
    AUTH_TRUST_HOST: string;
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: StringValue;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRES_IN: StringValue;

    KEYCLOAK_URL: string;
    KEYCLOAK_REALM: string;
    KEYCLOAK_CLIENT_ID: string;
    KEYCLOAK_CLIENT_SECRET: string;
    KEYCLOAK_ISSUER: string;
    KEYCLOAK_ADMIN_CLIENT_ID: string;
    KEYCLOAK_ADMIN_CLIENT_SECRET: string;
    SESSION_MAX_AGE: number;

    MQ_TYPE: string;
    KAFKA_BROKER_URL: string;
    RABBITMQ_URL: string;
  }
}

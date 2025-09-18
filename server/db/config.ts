const DEV = Deno.env.get("DEV_MODE")

function validateEnv() {
  const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missing = required.filter(key => !Deno.env.get(key));

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateEnv();

export const dbConfig = {
  hostname: Deno.env.get("DB_HOST") || 'localhost',
  port: parseInt(Deno.env.get("DB_PORT") || "5432"),
  database: Deno.env.get("DB_NAME"),
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  tls: {
    enabled: !DEV,
  },
};

import { Client } from "pg";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (e) {
    console.error("DB query error:", e);
    throw e;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

export default {
  query,
  getNewClient,
};

function getSSLValues() {
  // for self-signed certificate (digital ocean example)
  if (process.env.POSTGRESS_CA) {
    return {
      ca: process.env.POSTGRESS_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}

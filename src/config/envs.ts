const account_name = "orbiiprodfinance";
const container_name = "ksaopenbankingdev";
const token =
  "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupyx&se=2035-09-26T17:15:37Z&st=2024-09-26T09:15:37Z&spr=https&sig=UOY4t2nvHDNtqdr8G8%2F%2FV6Pxz7SerOeGHHXpeG2LESs%3D";

const credsForJson = {
  account_name,
  container_name,
  token,
};

export const APP_ENVS = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  isProductionMode: process.env.NODE_ENV == "production",
  ACCOUNT_NAME: process.env.ACCOUNT_NAME,
  CONTAINER_NAME: process.env.CONTAINER_NAME,
  DIRECTORY_NAME: process.env.DIRECTORY_NAME,
  SAS_TOKEN: process.env.SAS_TOKEN,
  credsForJson,

  uaeContainerName: "pdf-prod",

  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL!,
};

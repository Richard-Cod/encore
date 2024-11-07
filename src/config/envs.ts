interface ENVS {

}

export const APP_ENVS =  {
    API_BASE_URL : process.env.NEXT_PUBLIC_API_BASE_URL,
    productsPerPage : 5,
    isProductionMode : process.env.NODE_ENV == "production"
}
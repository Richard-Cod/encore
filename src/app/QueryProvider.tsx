"use client"
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'


// Create a client
export const queryClient = new QueryClient()


export const AppQueryProvider = ({children} : {children : any}) => {
  return (
    <QueryClientProvider client={queryClient}>
        {children}
  </QueryClientProvider>
  )
}

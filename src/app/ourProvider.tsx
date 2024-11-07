"use client"
import { store } from '@/logic/redux/store'
import React from 'react'
import { Provider } from 'react-redux'

export const OurStoreProvider = ({children} : {children : any}) => {
  return (
    <Provider store={store}>
        {children}
    </Provider>

  )
}

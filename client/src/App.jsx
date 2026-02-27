import { useState } from 'react'
import FormFIlter from './components/FormFIlter/FormFilter'
import './App.css'

function App() {

  const titleApp = "Welcome to HBA-Cash"
  const descriptionApp = "это приложение для получения таблицы из расчета резиденции"

  return (
    <>
      <h1>{ titleApp }</h1>
      <p>{ descriptionApp }</p>
      <FormFIlter></FormFIlter>
    </>
  )
}

export default App

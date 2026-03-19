import './FormFilter.css'
import axios from 'axios'
import dayjs from 'dayjs'
import { useState } from 'react'

import TableComponent from '../TableComponent/TableComponent/'

function FormFIlter() {

    const [startDate, setStartDate] = useState(dayjs(new Date).format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(dayjs(new Date).format('YYYY-MM-DD'))
    const [tableData, setTableData] = useState([])

    const apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjZiNjU5YjBlZWE3YzQwODVmOTAxNTciLCJsb2dpbiI6Iml2YW4iLCJpYXQiOjE3MjI2ODc5MzcsImV4cCI6Mzc3MjI2ODQzMzd9.9_UL1lKPhouKkbN9_ZMsjOEcqB87v5OujNae40aZxIs'

    const handleStartDate = (e) => {
        setStartDate(dayjs(e.target.value).format('YYYY-MM-DD'))
        console.log(startDate)
    }

    const handleEndDate = (e) => {
        setEndDate(dayjs(e.target.value).format('YYYY-MM-DD'))
        console.log(endDate)
    }

    async function fetchData() {

        const response = await axios.get("https://residence.hbnetwork.ru/api/leads", {
            params: {
                '_page': 1,
                '_limit': 0,
                'startedAt[]': ['gte:' + startDate, 'lte:' + endDate]
            },
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
        })

        let responseData = response.data.data

        responseData = responseData.filter((lead) => {
            return lead.status === 'hold'
        })

        const aggragatedDataObject = {}

        responseData.forEach((lead) => {

            let formattedDate = dayjs(lead.startedAt).format('YYYY-MM-DD')

            if (!aggragatedDataObject[formattedDate]) {
                aggragatedDataObject[formattedDate] = {
                    date: formattedDate,
                    countHold: 1,
                    sumHold: lead?.price?.offer || 0,
                    brokerSalary: lead?.price?.offer * 0.6 * 0.15
                }
            } else {
                aggragatedDataObject[formattedDate].countHold++,
                aggragatedDataObject[formattedDate].sumHold += lead?.price?.offer || 0,
                aggragatedDataObject[formattedDate].brokerSalary += lead?.price?.offer * 0.6 * 0.15
            }
        })

        setTableData(Object.values(aggragatedDataObject))

    }

    return (

        <>
        
            <div className="container">
                <input type="date" value={ startDate } onChange={ handleStartDate } />
                <input type="date" value={ endDate } onChange={ handleEndDate }></input>
                <button onClick={ fetchData }>Применить</button>
            </div>

            <div>
                <p>Выбраная начало времени: { startDate }</p>
                <p>Выбраное конец времени: { endDate }</p>
            </div>

            <TableComponent tableData={ tableData } />

        </>

    )

}


export default FormFIlter
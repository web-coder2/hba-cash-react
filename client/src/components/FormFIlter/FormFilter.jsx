import './FormFilter.css'
import axios from 'axios'
import dayjs from 'dayjs'
import { useState } from 'react'

import TableComponent from '../TableComponent/TableComponent/'

function FormFIlter() {

    const [startDate, setStartDate] = useState(dayjs(new Date).format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(dayjs(new Date).format('YYYY-MM-DD'))
    const [tableData, setTableData] = useState([])

    const [visibleBonusColumn, setVisibleBonusColumn] = useState(false)

    const handleStartDate = (e) => {
        setStartDate(dayjs(e.target.value).format('YYYY-MM-DD'))
        console.log(startDate)
    }

    const handleEndDate = (e) => {
        setEndDate(dayjs(e.target.value).format('YYYY-MM-DD'))
        console.log(endDate)
    }

    function changeVisibleColumn() {
        setVisibleBonusColumn(!visibleBonusColumn)
    }

    async function fetchData() {

        let localUrl = 'http://localhost:5000/api/hold/get'
        let newUrl = 'http://31.130.151.240:8000/api/hold/get'

        const response = await axios.get(newUrl, {
            params: {
                gte: startDate,
                lte: endDate
            }
        })

        console.log(response)

        const tableData = response.data.data

        setTableData(Object.values(tableData))

    }

    return (

        <>
        
            <div className="container">
                <input type="date" value={ startDate } onChange={ handleStartDate } />
                <input type="date" value={ endDate } onChange={ handleEndDate }></input>
                <button onClick={ fetchData }>Применить</button>
                <button onClick={ changeVisibleColumn }>{visibleBonusColumn ? 'скрыть' : 'показать'} бонусы</button>
            </div>

            <div>
                <p>Выбраная начало времени: { startDate }</p>
                <p>Выбраное конец времени: { endDate }</p>
            </div>

            <TableComponent tableData = { tableData } visibleBonusColumn = { visibleBonusColumn } />

        </>

    )

}


export default FormFIlter
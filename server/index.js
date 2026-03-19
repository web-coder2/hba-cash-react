const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors');
const axios = require('axios')
const dayjs = require('dayjs')

const PORT = 5000
const app = express()
const apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjZiNjU5YjBlZWE3YzQwODVmOTAxNTciLCJsb2dpbiI6Iml2YW4iLCJpYXQiOjE3MjI2ODc5MzcsImV4cCI6Mzc3MjI2ODQzMzd9.9_UL1lKPhouKkbN9_ZMsjOEcqB87v5OujNae40aZxIs'



app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../client/dist')));


app.get('/api/hold/get', async (req, res) => {

    try {

        const { gte, lte } = req.query
        const holdsStatuses = ['hold', 'confirmed', 'refused']

        const response = await axios.get("https://residence.hbnetwork.ru/api/leads", {
            params: {
                '_page': 1,
                '_limit': 0,
                'startedAt[]': ['gte:' + gte, 'lte:' + lte]
            },
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
        })

        let dataToSend = response.data.data
        
        let onlyHoldsArray = dataToSend.filter((item) => {
            return holdsStatuses.includes(item.status)
        })

        aggregatedObject = {}

        onlyHoldsArray.forEach((lead) => {
        
            let formattedDate = dayjs(lead.startedAt).format('YYYY-MM-DD')
        
            if (!aggregatedObject[formattedDate]) {
                aggregatedObject[formattedDate] = {
                    date: formattedDate,
                    countHold: 1,
                    sumHold: lead?.price?.offer || 0,
                    brokerSalary: lead?.price?.offer * 0.6 * 0.15
                }
            } else {
                aggregatedObject[formattedDate].countHold++,
                aggregatedObject[formattedDate].sumHold += lead?.price?.offer || 0,
                aggregatedObject[formattedDate].brokerSalary += lead?.price?.offer * 0.6 * 0.15
            }
        })

        const tableData = Object.values(aggregatedObject)

        res.status(200).json({
            data: tableData
        })

    } catch (e) {
        console.log(e.message)
        res.status(200).json({
            msg: e.message
        })
    }

})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})


app.listen(PORT, () => {
    console.log('server listening on', PORT)
})
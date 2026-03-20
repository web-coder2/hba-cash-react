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


async function getUsersStats(gte) {
    try {
        const response = await axios.get("https://residence.hbnetwork.ru/api/leads/salary", {
            params: {
                '_page': 1,
                '_limit': 0,
                'startedAt[]': ['gte:' + gte, 'lte:' + gte]
            },
            headers: {
                'Authorization': `Bearer ${apiToken}`
            }
        })
        return response.data.data.total.total
    } catch (e) {
        console.log(e)
        return []
    }
}

async function getSumHoldByOffers(date) {
    try {
        const response = await axios.get("https://residence.hbnetwork.ru/api/leads", {
            params: {
                '_page': 1,
                '_limit': 0,
                'startedAt[]': ['gte:' + date, 'lte:' + date]
            },
            headers: {
                'Authorization': `Bearer ${apiToken}`
            }
        })
        
        let leadData = response.data.data
        let allowedStatuses = ['hold', 'confirmed', 'refused']

        let onlyHolds = leadData.filter((lead) => {
            return allowedStatuses.includes(lead.status)
        })

        let fullSumPriceOffer = 0

        onlyHolds.forEach((item) => {
            fullSumPriceOffer += item.price.offer
            // fullSumPriceOffer += item.price.offer  * 0.6 // возмождно потмо вот так сделать по логике определеной
        })

        return fullSumPriceOffer

    } catch (e) {
        console.log(e)
    }
       
}

app.get('/api/hold/get', async (req, res) => {

    try {

        const { gte, lte } = req.query

        let tableData = []

        let startDate = dayjs(gte)
        let endDate = dayjs(lte)

        for ( let current = startDate; current.format('YYYY-MM-DD') <= endDate.format('YYYY-MM-DD'); current = current.add(1, 'day')) {

            let formattedDate = dayjs(current).format('YYYY-MM-DD')

            let usersSalaryObjectToDate = await getUsersStats(formattedDate)
            
            let sumOffer = await getSumHoldByOffers(formattedDate)


            let sumSalary = usersSalaryObjectToDate.hold.sum
            let sumBonuses = usersSalaryObjectToDate.bonuses
            let sumPay = usersSalaryObjectToDate.minuses

            let brokerSalary = (sumSalary * 2 * 0.6) + sumBonuses + sumPay + 4000

            tableData.push({
                date: formattedDate,
                countHold: usersSalaryObjectToDate.hold.count,
                sumHold: usersSalaryObjectToDate.hold.sum * 2,
                brokerSalary: brokerSalary,
                bonuses: sumBonuses,
                sumPay: sumPay,
                sumOffer: sumOffer,
            })
            
        }


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
import './TableComponent.css'

function TableComponent({ tableData, visibleBonusColumn }) {


    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Кол-во холдов</th>
                        <th>Сума холдов</th>
                        <th>ЗП брокеров</th>
                        { visibleBonusColumn ? <th>Бонусы</th> : null }
                        { visibleBonusColumn ? <th>Минусы</th> : null }
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((item, index) => (
                        <tr>
                            <td>{item.date}</td>
                            <td>{Math.round(item.countHold)}</td>
                            <td>{Math.round(item.sumHold)}</td>
                            <td>{Math.round(item.brokerSalary)}</td>
                            { visibleBonusColumn ? <td>{Math.round(item.bonuses)}</td>  : null }
                            { visibleBonusColumn ? <td>{Math.round(item.sumPay)}</td>  : null }
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default TableComponent
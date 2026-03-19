import './TableComponent.css'

function TableComponent({ tableData }) {


    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Кол-во холдов</th>
                        <th>Сума холдов</th>
                        <th>ЗП брокеров</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((item, index) => (
                        <tr>
                            <td>{item.date}</td>
                            <td>{Math.round(item.countHold)}</td>
                            <td>{Math.round(item.sumHold)}</td>
                            <td>{Math.round(item.brokerSalary)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default TableComponent
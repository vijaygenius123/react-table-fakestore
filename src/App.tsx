import React, {useEffect, useMemo, useState} from 'react';
import {useTable} from 'react-table'
import axios from 'axios';

function App() {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        const {data} = await axios.get("https://fakestoreapi.com/products")
        setProducts(data)
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const columns = useMemo(() => ([
        {
            Header: 'Id',
            accessor: 'id'
        },
        {
            Header: 'Price',
            accessor: 'price'
        },
        {
            Header: 'Title',
            accessor: "title"
        }
    ]), [])

    // @ts-ignore
    const tableInstance = useTable({columns, data: products})
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = tableInstance;
    return (
        <div className="container">
            <table {...getTableProps} className={"table-auto min-w-full text-center border"}>
                <thead>
                {headerGroups.map((headerGroup,) => (
                    <tr {...headerGroup.getHeaderGroupProps()} className={"border-b"}>
                        {
                            headerGroup.headers?.map(column => (
                                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                            ))
                        }
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row)
                    return <tr {...row.getRowProps()}>{
                        row.cells.map((cell,) =>
                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>)
                    }</tr>
                })}
                </tbody>
            </table>
        </div>
    );
}

export default App;

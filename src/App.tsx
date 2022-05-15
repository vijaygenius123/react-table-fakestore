import React, {useEffect, useMemo, useState} from 'react';
import {useTable, useSortBy} from 'react-table'
import cn from 'classnames'
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

    const productsData = useMemo(() => [...products], [products])
    const productsColumn = useMemo(() => products[0] ? Object.keys(products[0])
        .filter((key) => key !== "rating")
        .map(key => {
            if (key === 'image') {
                return {
                    Header: key,
                    accessor: key,
                    Cell: ({value}: { value: string }) => {
                        return <img src={value} alt={value}/>;
                    },
                    maxSize: 40
                }
            }
            return {
                Header: key,
                accessor: key
            }
        }) : [], [products])

    const tableHooks = (hooks: { visibleColumns: ((columns: any) => void)[]; }) => {
        hooks.visibleColumns.push((columns) => [
            ...columns, {
                id: 'edit',
                Header: 'Edit',
                Cell: ({row}: { row: { id: string } }) => (
                    <button onClick={() => {
                        alert(`Clicked on ${row?.id}`)
                    }} className={"px-2 py-1 inline-block outline-0"}> Edit </button>
                )
            }
        ])
    }

    // @ts-ignore
    const tableInstance = useTable({columns: productsColumn, data: productsData}, tableHooks, useSortBy)

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = tableInstance;
    // @ts-ignore
    return (
        <div className="container mx-auto py-4">
            <h1 className={"text-2xl text-center"}>Products</h1>
            <table {...getTableProps} className={"table-auto min-w-full text-center border"}>
                <thead>
                {headerGroups.map((headerGroup,) => (
                    <tr {...headerGroup.getHeaderGroupProps()} className={"border-b"}>
                        {
                            headerGroup.headers?.map(column => (
                                //@ts-ignore
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className={"border-b"}>
                                    {column.render("Header")}
                                    {
                                        //@ts-ignore
                                        column.isSorted ? (column.isSortedDesc ? "↓" : "↑") : "" }
                                </th>
                            ))
                        }
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row, idx) => {
                    prepareRow(row)
                    return <tr {...row.getRowProps()}
                               className={cn({' bg-green-200': idx % 2 === 0}, 'border', 'bg-opacity-30')}>{
                        row.cells.map((cell,) =>
                            <td {...cell.getCellProps()} className={"border"}>{cell.render("Cell")}</td>)
                    }</tr>
                })}
                </tbody>
            </table>
        </div>
    );
}

export default App;

import React from 'react';
import Card from "../../components/Card"
import { formatString } from "../../utilities/dateUtil"
import { formatMoney } from '../../utilities/utilities';

const HistoryColumn = ({ children, className }) => {
    return (
        <td className={["px-6 py-4 whitespace-nowrap", className].join(' ')}>
            {children}
        </td>
    )
}

const HistoryRow = ({bid : { bidAt, user, amount }}) => {
    const profilePict = user.profilePict || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    return (
        <tr>
            <HistoryColumn>
                <div className="text-sm text-gray-500">{formatString(bidAt)}</div>
            </HistoryColumn>
            <HistoryColumn>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {formatMoney(amount)}
                </span>
            </HistoryColumn>
            <HistoryColumn>
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={profilePict} alt="" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {(user||{}).name}
                        </div>
                    </div>
                </div>
            </HistoryColumn>
        </tr >
    )
}

const HistoryHeader = ({ children }) => {
    return (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {children}
        </th>
    )
}

const BidHistory = ({ bids }) => {
    return (
        <Card className="mt-6 p-4">
            <h1 className="font-semibold text-gray-700 text-lg mb-4">Bid History</h1>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <HistoryHeader>
                                            Time
                                            </HistoryHeader>
                                        <HistoryHeader>
                                            Amount
                                            </HistoryHeader>
                                        <HistoryHeader>
                                            Name
                                        </HistoryHeader>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bids.map(bid => {
                                        return <HistoryRow bid={bid} key={bid._id}></HistoryRow>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default BidHistory
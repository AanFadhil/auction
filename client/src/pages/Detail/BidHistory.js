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

const HistoryRow = ({ bidAt, user, amount }) => {
    return (
        <tr>

            <HistoryColumn>
                <div class="text-sm text-gray-500">{formatString(bidAt)}</div>
            </HistoryColumn>
            <HistoryColumn>
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {formatMoney(amount)}
                </span>
            </HistoryColumn>
            <HistoryColumn>
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60" alt="" />
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                            {user.name}
                        </div>
                    </div>
                </div>
            </HistoryColumn>
        </tr >
    )
}

const HistoryHeader = ({ children }) => {
    return (
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {children}
        </th>
    )
}

const BidHistory = ({ bids }) => {
    return (
        <Card className="mt-6 p-4">
            <h1 className="font-semibold text-gray-700 text-lg mb-4">Bid History</h1>
            <div class="flex flex-col">
                <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
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
                                <tbody class="bg-white divide-y divide-gray-200">
                                    {bids.map(bid => {
                                        return <HistoryRow bid={bid}></HistoryRow>
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
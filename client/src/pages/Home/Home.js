import Layout from '../../hoc/layout'
import SearchBox from '../../components/SearchBox'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Card from '../../components/Card';
import * as itemsActions from '../../store/actions/items';
import Pagination from '../../components/Pagination';
import { formatMoney } from '../../utilities/utilities';
import { formatDistanceToNow, toDate } from '../../utilities/dateUtil';
import LinkButton from '../../components/LinkButton';
import Loading from '../../components/Loading';

const ItemCard = ({ item: { _id, desc, name, thumbnail, startingPrice, closeTime } }) => {
    return (
        <Card className="group shadow-lg h-auto flex flex-col">
            <div className="overflow-hidden inline-block h-60 rounded-t-md">
                <img src={thumbnail ? thumbnail : ("https://picsum.photos/300?random=" + _id)} className="object-cover w-full h-52 md:h-72 rounded-t-md object-center transform scale-110 group-hover:scale-100 transition duration-300 -translate-y-1 group-hover:translate-y-0 ease-out" />
            </div>
            <div className="px-4 py-2 inline-block flex-grow">
                <h2 className="font-bold text-lg h-16">{name}</h2>
                <h3 className="text-gray-600">{formatMoney(startingPrice)} | {toDate(closeTime) > new Date() ? formatDistanceToNow(closeTime): <span className="text-red-600">Closed</span>}</h3>
                <p className="text-sm mt-2 pb-4 text-gray-500">
                    {desc.length > 100 ? desc.substring(0, 50) + '....' : desc}
                </p>
            </div>
            <div className="w-full p-4">
                <LinkButton to={`/item/${_id}`} className="w-full">Bid Now</LinkButton>
            </div>
        </Card>
    )
}

const SortBy = ({ children, onClick, currentSort = false }) => {
    return (
        <span
            onClick={onClick}
            className={[currentSort ? "bg-gray-300" : "hover:bg-gray-100 cursor-pointer", "block px-4 py-2 text-xs text-gray-700"].join(' ')}>
            {children}
        </span>
    )
}

const sortByItems = [
    { label: "Newest", sort: "createdAt", sortdir: "0" },
    { label: "Price : Low to High", sort: "currentTopBid", sortdir: "1" },
    { label: "Price : High to Low", sort: "currentTopBid", sortdir: "0" },
    { label: "Closing Time : Sooner to Later", sort: "closeTime", sortdir: "1" },
    { label: "Closing Time : Later to Sooner", sort: "closeTime", sortdir: "0" }
]

const Home = ({ items, loading, getItems }) => {
    const [listState, setListState] = useState({
        search: '',
        pageLimit: 10,
        totalRecords: 0,
        sort: '',
        sortdir: 1,
        sortLabel: ""
    })

    const [showSort, setShowSort] = useState(false)

    const getPage = ({
        page,
        pageSize,
        search,
        sort,
        sortdir,
        sortLabel
    }) => {
        getItems({
            page,
            pageSize,
            search,
            sort,
            sortdir
        })
            .then(res => {
                setListState({
                    ...listState,
                    totalRecords: res.count,
                    page,
                    pageSize,
                    search,
                    sort,
                    sortdir,
                    sortLabel
                })
            })
    }

    useEffect(() => {
        getItems({
            page: 1,
            pageSize: 10,
            search: '',
            sort: '',
            sortdir: ''
        })
    }, [])

    const searchChanged = ({ value }) => {
        getItems({
            ...listState,
            search: value
        })
    }

    const onPageChange = pagingData => {
        getPage({
            ...listState,
            page: pagingData.currentPage,
            pageSize: pagingData.pageLimit,
        })

    }

    const onToggleSort = evt => {
        evt.stopPropagation()
        setShowSort(prevstate => !prevstate)
    }

    const onSelectSort = ({ sort, sortdir, label }) => {
        getPage({
            ...listState,
            sortdir,
            sort,
            sortLabel: label
        })
        setShowSort(false)
    }

    return (
        <Layout title="Home" onClick={() => setShowSort(false)}>
            <Card className="flex flex-col flex-wrap md:flex-row space-be w-auto p-4 content-center mx-2 md:mx-0 mb-8">
                <div className="leading-10 flex-grow">Find our best antique collection </div>
                <SearchBox groupclass=" w-full md:w-1/2" placeholder="Search..." changed={searchChanged} searchDelay={450} />
                <div className="ml-3 relative">
                    <div>
                        <button type="button" onClick={onToggleSort} className="ml-auto md:ml-0 max-w-xs hover:text-blue-700 rounded-md flex justify-center py-2 px-4 items-center focus:outline-none" aria-expanded="false" aria-haspopup="true">
                            <span className="sr-only">Open user menu</span>
                            sort
                        </button>
                    </div>
                    {showSort ?
                        <div className="origin-top-right z-20 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                            {
                                sortByItems.map(sort => {
                                    return <SortBy key={sort.label} currentSort={sort.label === listState.sortLabel} onClick={() => onSelectSort(sort)}>{sort.label}</SortBy>
                                })
                            }
                        </div> : null}
                </div>
            </Card>
            
            {loading ?
                <Loading />
                :
                <section className="grid grid-cols-1 md:grid-cols-5 px-4 md:px-0 gap-x-4 gap-y-8 md:gap-y-4">
                    {
                        ((items || {}).data || []).map(item => <ItemCard item={item} key={item._id} />)
                    }
                </section>
            }
            <Pagination className="mt-6 mx-2 md:mx-0" totalRecords={listState.totalRecords}
                pageLimit={listState.pageLimit}
                pageNeighbours={1} onPageChanged={onPageChange} />
        </Layout>
    )
}

const mapStateToProps = state => {
    return {
        items: state.item.items,
        loading: state.item.loading.items
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getItems: data => dispatch(itemsActions.getItemList(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)
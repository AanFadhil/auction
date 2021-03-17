import Layout from '../../hoc/layout'
import SearchBox from '../../components/SearchBox'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Card from '../../components/Card';
import * as itemsActions from '../../store/actions/items';
import Pagination from '../../components/Pagination';
import Button from '../../components/Button';
import { formatMoney } from '../../utilities/utilities';
import { formatDistanceToNow } from '../../utilities/dateUtil';
import LinkButton from '../../components/LinkButton';

const Home = ({ items, loading, getItems }) => {
    const [listState, setListState] = useState({
        search: '',
        pageLimit: 20,
        totalRecords: 0,
        sort: '',
        sortdir: 1
    })

    const getPage = ({
        page,
        pageSize,
        search,
        sort,
        sortdir
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
                    sortdir
                })
            })
    }

    useEffect(() => {
        getItems({
            page: 1,
            pageSize: 20,
            search: '',
            sort: '',
            sortdir: ''
        })
    }, [])

    const searchChanged = ({ value }) => {
        getItems({
            ...listState,
            search : value
        })
    }

    const onPageChange = pagingData => {
        getPage({
            ...listState,
            page: pagingData.currentPage,
            pageSize: pagingData.pageLimit,
        })

    }


    return (
        <Layout title="Home">
            <SearchBox placeholder="Search..." changed={searchChanged} searchDelay={450} />

            {loading ?
                <div>Loading</div>
                :
                <section className="grid grid-cols-1 md:grid-cols-5 px-4 md:px-16 gap-x-4 gap-y-2 md:gap-y-4">
                    {
                        ((items || {}).data || []).map(({ _id, desc, name, thumbnail, startingPrice, closeTime }) => (
                            <div className="p-2" key={_id}>

                                <Card className="group shadow-lg overflow-hidden">
                                    <div className="overflow-hidden">
                                        <img src={thumbnail ? thumbnail : ("https://picsum.photos/300?random=" + _id)} className="object-cover w-full h-52 md:h-60 rounded-t-md object-center transform scale-110 group-hover:scale-100 transition duration-300 -translate-y-1 group-hover:translate-y-0 ease-out" />
                                    </div>
                                    <div className="px-4 py-2">
                                        <h2 className="font-bold text-lg">{name}</h2>
                                        <h3 className="text-gray-600">{formatMoney(startingPrice)} | {formatDistanceToNow(closeTime)}</h3>
                                        <p className="text-sm mt-2 pb-4 text-gray-500">
                                            {desc.length > 100 ? desc.substring(0,50)+'....':desc}
                                        </p>
                                        <LinkButton to={`/item/${_id}`}>Bid Now</LinkButton>
                                    </div>
                                </Card>
                            </div>
                        ))

                    }
                </section>
            }
            <Pagination totalRecords={listState.totalRecords}
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
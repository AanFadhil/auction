import { useEffect } from 'react';
import { useParams } from 'react-router';
import Layout from '../../hoc/layout';
import { connect } from 'react-redux';
import * as itemsActions from '../../store/actions/items';
import Loading from '../../components/Loading';
import Card from '../../components/Card';
import TextBox from '../../components/TextBox';
import { formatMoney } from '../../utilities/utilities';
import { formatDistanceToNow, formatString } from '../../utilities/dateUtil';
import BidHistory from './BidHistory';
import Button from '../../components/Button';

const Detail = ({ getItemById, loading, item }) => {

    const params = useParams()

    useEffect(() => {
        getItemById(params.id)
    }, [])

    useEffect(() => {
        getItemById(params.id)
    }, [params.id])

    if (loading) {
        return <Loading />
    }

    return (
        <Layout title="Item Detail">
            <Card className="flex flex-col md:flex-row pb-4 mx-2 md:mx-0 md:px-4 md:pt-4">

                <img src={item.thumbnail} alt={item.name} className="w-full max-h-64 md:w-1/3 md:rounded-md sm:rounded-t-md" />
                <div className="md:ml-4 md:mr-4 mt-6 md:mt-none px-4">
                    <h1 className="font-bold text-xl">{item.name}</h1>
                    <div>Current Bid : <span className="text-green-700 font-semibold">{formatMoney((item.currentTopBid || item.startingPrice))}</span></div>
                    <div>Ends in : {formatDistanceToNow(item.closeTime)}</div>
                    <p className="mt-3 text-gray-600">{item.desc}</p>
                    <div className="mt-8">
                        <TextBox placeholder="amount" type="number" hasError helptext="test" />
                    </div>
                    <Button className="w-32">Bid</Button>
                </div>
            </Card>
            <BidHistory bids={item.bids} error={true}></BidHistory>
        </Layout>
    )
}

const mapStateToProps = state => {
    return {
        item: state.item.item,
        loading: state.item.loading.item
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getItemById: id => dispatch(itemsActions.getItemById({ id }))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail)
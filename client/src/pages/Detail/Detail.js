import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Layout from '../../hoc/layout';
import { connect } from 'react-redux';
import * as itemsActions from '../../store/actions/items';
import * as bidActions from '../../store/actions/bid';
import Loading from '../../components/Loading';
import Card from '../../components/Card';
import TextBox from '../../components/TextBox';
import { formatMoney } from '../../utilities/utilities';
import { formatDistanceToNow, formatString, toDate } from '../../utilities/dateUtil';
import BidHistory from './BidHistory';
import Button from '../../components/Button';
import CheckBox from '../../components/Checkbox';
import CountDown from './CountDown';

const Detail = ({ getItemById, loading, item, placeBid, user, setAutoBid }) => {

    const params = useParams()

    const [form, setForm] = useState({
        amount: item.currentTopBid,
        amountIsDirty: false,
        autoBid: (item.autoBidders || []).includes(user.id)
    })

    useEffect(() => {
        getItemById(params.id)
    }, [])

    useEffect(() => {
        getItemById(params.id)
    }, [params.id])
    
    useEffect(() => {

        setForm({
            amount: item.currentTopBid,
            amountIsDirty: false,
            autoBid: (item.autoBidders || []).includes(user.id)
        })

    }, [item._id])

    if (loading) {
        return <Loading />
    }

    const onAmountBlur = () => {
        setForm(prevState => {
            if (prevState.amountIsDirty) return { ...prevState }
            else return {
                ...prevState,
                amountIsDirty: true
            }
        })
    }

    const onPlaceBid = () => {
        placeBid({
            itemId: item._id,
            amount: form.amount
        }).then(res => getItemById(params.id))
    }

    const onAmountChanged = evt => {
        if (evt.target.value <= item.currentTopBid) {
            setForm({
                ...form,
                amount: evt.target.value
            })
        } else {
            setForm({
                ...form,
                amount: evt.target.value
            })
        }
    }

    const onAutoBidChanged = evt => {
        
        setAutoBid({
            autobid: evt.target.checked,
            itemId: item._id
        })

        setForm({
            ...form,
            autoBid: evt.target.checked
        })

    }

    const isAmountError = form.amount <= item.currentTopBid && form.amountIsDirty && !form.autoBid
    const isTopBidder = (item.highestBidder || {})._id === user.id
    const autoBidCb = <CheckBox key={item._id} className="mt-0" checked={form.autoBid} changed={onAutoBidChanged} label="Auto Bid" />
    return (
        <Layout title="Item Detail">
            <Card className="flex flex-col md:flex-row pb-4 mx-2 md:mx-0 md:px-4 md:pt-4">

                <img src={item.thumbnail} alt={item.name} className="w-full max-h-64 md:w-1/3 md:rounded-md sm:rounded-t-md" />
                <div className="md:ml-4 md:mr-4 mt-6 md:mt-none px-4">
                    <h1 className="font-bold text-xl">{item.name}</h1>
                    <div>Current Bid : <span className="text-green-700 font-semibold">{formatMoney(item.currentTopBid || 0)}</span></div>
                    <div>Starting Price : {formatMoney(item.startingPrice)}</div>
                    <div>Ends in : <CountDown end={toDate(item.closeTime)} /></div>
                    <p className="my-3 text-gray-600">{item.desc}</p>
                    <hr />
                    {isTopBidder ?
                        <>
                            <div className="mt-6 font-semibold text-green-600">You are the current highest bidder</div>
                        </>
                        :
                        <>
                            <div className="mt-4 mb-2">
                                <TextBox groupclass="w-full md:w-40"
                                    onblur={onAmountBlur}
                                    disabled={form.autoBid}
                                    label="place your bid" placeholder="amount" type="number"
                                    value={form.amount} changed={onAmountChanged} hasError={isAmountError} helptext={isAmountError ? 'Invalid amount' : null} />
                            </div>
                            <div className="flex flex-row gap-x-6">
                                <Button className="w-24" clicked={onPlaceBid}
                                    disabled={form.amount <= item.currentTopBid || form.autoBid}>Bid</Button>
                                
                            </div>
                        </>
                    }
                    {autoBidCb}
                </div>
            </Card>
            <BidHistory bids={item.bids} error={true}></BidHistory>
        </Layout>
    )
}

const mapStateToProps = state => {
    return {
        item: state.item.item,
        loading: state.item.loading.item,
        bidloading: state.bid.loading.bid,
        user: state.auth.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getItemById: id => dispatch(itemsActions.getItemById({ id })),
        placeBid: data => dispatch(bidActions.placeBid(data)),
        setAutoBid: ({ autobid, itemId }) => dispatch(bidActions.setAutoBid({ autobid, itemId }))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Detail)
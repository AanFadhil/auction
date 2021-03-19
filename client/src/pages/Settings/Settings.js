import {connect} from 'react-redux';
import Layout  from '../../hoc/layout'
import Card  from '../../components/Card'
import TextBox  from '../../components/TextBox'
import Button  from '../../components/Button'
import * as settingsActions  from '../../store/actions/settings'
import { useEffect, useState } from 'react';

const Settings = ({getSettings, setSettings, settings, loading}) => {

    const [form,setForm] = useState({ maxAutoBidAmount : settings.maxAutoBidAmount })

    useEffect(() => {
        getSettings()
            .then(res => {
                setForm({
                    maxAutoBidAmount : res.maxAutoBidAmount
                })
            })
    },[])

    const onSave = () => {
        setSettings({maxAutoBidAmount: form.maxAutoBidAmount})
    }

    const onTextBoxChange = evt => {
        setForm({
            maxAutoBidAmount : evt.target.value
        })
    }

    return(
        <Layout title="Settings">
            <Card className="w-full md:w-2/3 md:mx-auto p-6 flex flex-col gap-y-4">
                <TextBox label="Max Auto Bid Amount" value={form.maxAutoBidAmount} type="number" changed={onTextBoxChange} />
                <Button className="w-40 mx-auto" clicked={() => onSave()}>Save</Button>
            </Card>
        </Layout>
    )
}

const mapStateToProps = state => {
    return {
        loading: state.settings.loading,
        settings: state.settings.settings,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getSettings: () => dispatch(settingsActions.getSettings()),
        setSettings: data => dispatch(settingsActions.setSettings(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
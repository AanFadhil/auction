import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import * as authactions from '../../store/actions/auth'
import { useState } from 'react'
import TextBox from '../../components/TextBox';
import Button from '../../components/Button';
const Login = ({ login }) => {

    const [form, setForm] = useState({
        email: '',
        password: '',
        message : ''
    })

    const onChange = evt => {

        setForm({
            ...form,
            [evt.target.name]: evt.target.value
        })
    }
    let history = useHistory();
    const onSignin = () => {
        login(form)
            .then(data => {
                if (data.success) {
                    history.push('/')
                } else {
                    setForm({
                        ...form,
                        message : data.message
                    })
                }
            })
            .catch(err => {
                if (err.response) {
                    this.setState({ ...this.state, error: err.response.data.message })
                }
            })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 w-full">
                        Sign in to your account
                    </h2>
                </div>
                <div className="mt-8 space-y-6">
                    <input type="hidden" name="remember" value="true" />
                    <h2 className="font-semibold text-red-700 text-center">{form.message}</h2>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <TextBox label="Email" groupclass="mb-2" placeholder="Email" value={form.email} changed={onChange} name="email" type="email" />
                        <TextBox label="Password" placeholder="Password" value={form.password} changed={onChange} name="password" type="password" />
                    </div>

                    <div>
                        <Button className="w-full" clicked={() => onSignin()}>
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Sign in
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
        login: data => dispatch(authactions.login(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
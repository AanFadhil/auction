import React from 'react'

import { componentId } from '../utilities/utilities'


const Button = ({ loading: isloading, type, disabled, className: classnameProp, center, middle, clicked, confirm, id, children, confirmtext }) => {

    const loading = typeof isloading === "undefined" ? null : isloading
    const [confirming, setConfirming] = React.useState(null)
    //const [loading, setLoading] = React.useState(false)

    const className = ["group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
        classnameProp,
        disabled ? '' : ''
    ];

    const onClick = evt => {

        if (!loading) {
            if (confirming) {
                (clicked || (() => { }))(evt)
                setConfirming(false)
            } else if (confirm) {
                setTimeout(() => setConfirming(false), 3000);
                setConfirming(true)

            } else if (!confirm) {
                (clicked || (() => { }))(evt)
            }
        }

    }


    return (
        <button
            id={id} className={className.join(' ')} disabled={disabled || false} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button
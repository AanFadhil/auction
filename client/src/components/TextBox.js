import React from 'react'

import { componentId } from '../utilities/utilities'

const TextBox = ({
    id: idProps,
    textarea,
    type,
    changed,
    className,
    append,
    prepend,
    label,
    groupclass,
    rows,
    hasError,
    placeholder,
    value,
    name,
    disabled,
    readOnly,
    onfocus,
    onblur,
    clicked,
    onPaste,
    helptext,
    autoComplete
}) => {
    const id = idProps || componentId('textBox');
    const I = textarea ? `textarea` : `input`
    console.log(hasError);
    const border = hasError ? 'border-red-300' : 'border-gray-300'

    const onChange = evt => {
        if (type === "number") {
            let numvalue = parseInt(evt.target.value)
            changed({
                ...evt,
                target: {
                    ...evt.target,
                    value: numvalue !== NaN ? numvalue : evt.target.value,
                    name: evt.target.name
                }
            })
        } else {
            changed(evt)
        }
    }
    return (
        <div className={[groupclass].join(' ')}>
            {label ? <label htmlFor={id} className="">{label}</label> : null}
            <input
                className={`${className} ${border} appearance-none rounded-md relative block w-full px-3 py-2 border  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                type={type}
                rows={rows || 5}
                id={id} aria-describedby={'helper' + id}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                name={name}
                disabled={disabled}
                readOnly={readOnly}
                onFocus={onfocus}
                onBlur={onblur}
                onClick={clicked}
                onPaste={onPaste}
                rows={rows}
                autoComplete={autoComplete}
            />
            <span className={["text-xs ",hasError  ? "text-red-300":"text-gray-500"].join(' ')}>{helptext}</span>
        </div>
    )
}


export default TextBox

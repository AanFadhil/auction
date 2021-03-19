import { Link } from 'react-router-dom'

const LinkButton = ({ rootelement, className:classNameProp, target, to, disabled, clicked, children }) => {
    let className = "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    const E = rootelement === 'a' ? `a` : Link

    return (
        <E className={[classNameProp,className ].join(' ')} target={target} to={to} href={to} disabled={disabled || false} onClick={clicked}>{children}</E>
    )
}

export default LinkButton
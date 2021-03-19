import React from 'react';
const Card = ({children,className}) => {
    
    return(
        <div className={["bg-white rounded-md shadow-md",className].join(' ')}>
            {children}
        </div>
    )
}

export default Card
import React from 'react'

function MenuContainer({ link, icon }) {
    return (
        <div>
            <li className={`active` }>
                <a href={link}>
                    <span className="icon">{icon}</span>
                </a>
            </li>
        </div>
    )
}

export default MenuContainer
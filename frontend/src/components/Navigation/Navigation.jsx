import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import './Navigation.css';
import AuthContext from "../../contexts/auth-context"

const Navigation = props => {

    return (
        <AuthContext.Consumer>
            {context => {
                return (
                    <header className="main-navigation-header">
                        <div className="main-navigation-logo">
                            <h1>Your BooKING</h1>
                        </div>
                        <nav className="main-navigation-items">
                            <ul>
                                {!context.token && <li>
                                    <NavLink to="/signup">Sign in</NavLink>
                                </li>}
                                <li>
                                    <NavLink to="/events">Events</NavLink>
                                </li>
                                {context.token && (<>
                                    <li>
                                        <NavLink to="/bookings">Bookings</NavLink>
                                    </li>
                                    <li>
                                        <Button onClick={context.logout} className="app-btn">Logout</Button>
                                    </li>
                                </>)
                                }
                            </ul>
                        </nav>
                    </header>
                )
            }}
        </AuthContext.Consumer>
    )
}

export default Navigation
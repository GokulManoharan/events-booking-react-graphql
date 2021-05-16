import React, { useState } from 'react';
import { Col } from 'react-bootstrap';

import './EventCard.css';

const EventCard = ({ event }) => {

    return (
        <Col lg={4} md={4} sm={6} xs={12} className="event-card-wrapper">
            <div>
                <p>{event.title}</p>
                <p>{event.price}</p>
                <p>{event.description}</p>
                <p>{event.creator.firstName}</p>
            </div>
        </Col>
    )
}

export default EventCard;
import React, { useState, useRef, useContext, useEffect } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import AppModal from "../components/Modals/Modal";
import EventCard from "../components/EventCard/EventCard";
import axios from 'axios';
import AuthContext from "../contexts/auth-context";

import './Events.css';

const EventsPage = () => {

    const [modalShow, setModalShow] = useState(false);
    const [availableEvents, setAvailableEvents] = useState([]);
    const titleEl = useRef();
    const priceEl = useRef();
    const dateEl = useRef();
    const descriptionEl = useRef();
    const auth = useContext(AuthContext);

    useEffect(() => {
        fetchEvents();
    }, [])

    const fetchEvents = _ => {
        const body = {
            "query": `
                query {
                    events {
                        title
                        date
                        price
                        description
                        _id
                        creator {
                            email
                            firstName
                            lastName
                        }
                      }
                }
            `
        }
        axios.post('http://localhost:5000/graphql',
            JSON.stringify(body),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            }).then(res => {
                if (![200, 201].includes(res.status)) {
                    throw new Error('Failed')
                }
                setAvailableEvents(res.data.data.events);
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    const handleSubmit = e => {
        e.preventDefault();
        const title = titleEl.current.value;
        const price = +priceEl.current.value;
        const date = dateEl.current.value;
        const description = descriptionEl.current.value;

        const event = { title, price, date, description };
        if (!title.trim() || price <= 0 || !description.trim() || !date.trim()) {
            return
        }

        const body = {
            query: `
                mutation {
                    createEvent(eventInput: {
                        title: "${title}",
                        price: ${price},
                        date: "${date}",
                        description: "${description}"
                    }){
                        title
                        price
                        date
                        description
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        }

        axios.post('http://localhost:5000/graphql',
            JSON.stringify(body),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            }).then(res => {
                if (![200, 201].includes(res.status)) {
                    throw new Error('Failed');
                }
                setModalShow(!modalShow);
            })
            .catch(err => {
                setModalShow(!modalShow);
                throw new Error('err');
            })
    }


    return (
        <>
            {
                auth.token &&
                <div className="events-control" >
                    <p>Let others know your event plans!</p>
                    <Button className="app-btn" size="lg" onClick={() => setModalShow(!modalShow)} block>
                        Create an event
                    </Button>

                    {
                        availableEvents.length > 0 && 
                        <Row>

                            {
                                availableEvents.map(event => {
                                    return <EventCard event={event} />
                                })
                            }
                        </Row>
                    }

                    <AppModal
                        title="Add an event"
                        show={modalShow}
                        setModalShow={setModalShow}
                        handleSubmit={handleSubmit}
                    >
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="event-form-wrapper">
                                <Row>
                                    <Col md={12} sm={12}>
                                        <Form.Label column="md" lg={12}>
                                            Title
                                 </Form.Label>
                                        <Form.Control ref={titleEl} size="md" type="text" placeholder="Title" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} sm={12}>
                                        <Form.Label column="md" lg={12}>
                                            Price
                                 </Form.Label>
                                        <Form.Control ref={priceEl} size="md" type="number" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} sm={12}>
                                        <Form.Label column="md" lg={12}>
                                            Date
                                 </Form.Label>
                                        <Form.Control ref={dateEl} size="md" type="datetime-local" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} sm={12}>
                                        <Form.Label column="md" lg={12}>
                                            Description
                                 </Form.Label>
                                        <Form.Control ref={descriptionEl} as="textarea" size="md" placeholder="Description" />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Form>
                    </AppModal>
                </div >
            }
        </>
    )
}

export default EventsPage;
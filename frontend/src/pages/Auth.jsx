import React, { useState, useRef, useContext } from 'react';
import { Form, Col, Button, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import AuthContext from "../contexts/auth-context";
import './Auth.css';

const TabHeader = ({ text, active }) => (<h3 className={`tab-title ${active ? "tab-title-active" : ""}`}>{text}</h3>)

const AuthTabs = ({ title, setKey }) => (
    <Tabs
        activeKey={title}
        onSelect={(k) => setKey(k)}
    >
        <Tab eventKey="signIn" title={<TabHeader text="Sign in" active={title === "signIn"} />} />
        <Tab eventKey="signUp" title={<TabHeader text="Sign Up" active={title === "signUp"} />} />
    </Tabs>
)

const SignUp = props => {
    const [key, setKey] = useState('signIn');
    const [isLoading, setisLoading] = useState(false);
    const emailEl = useRef();
    const passwordEl = useRef();
    const firstNameEl = useRef();
    const lastNameEl = useRef();
    const auth = useContext(AuthContext);

    const handleSubmit = e => {
        e.preventDefault();
        const email = emailEl.current.value;
        const password = passwordEl.current.value;
        let firstName, lastName;
        if(key === "signUp")
        {
            firstName = firstNameEl.current.value;
            lastName = lastNameEl.current.value;
        }
        

        if (email.trim().length === 0 || password.trim().length === 0) {
            return
        }
        setisLoading(true);
        let body;

        if (key === "signIn") {
            body = {
                query: `
                    query {
                        login(
                            email: "${email}",
                            password: "${password}"
                        ){
                            tokenExpiration
                            token
                            userId
                        }
                    }
                `
            }
        } else {
            body = {
                query: `
                    mutation {
                        createUser(userInput: {
                            email: "${email}",
                            password: "${password}",
                            firstName: "${firstName}",
                            lastName: "${lastName}",
                        }){
                            _id
                            email
                        }
                    }
                `
            }
        }

        axios.post('http://localhost:5000/graphql',
            JSON.stringify(body),
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (![200, 201].includes(res.status)) {
                    throw new Error('Failed')
                }
                setisLoading(false);
                if (res.data.data.hasOwnProperty('login') && res.data.data.login.hasOwnProperty('token')) {
                    auth.login(res.data.data.login.userId, res.data.data.login.token, res.data.data.login.tokenExpiration);
                }
                console.log(res)
            })
            .catch(err => console.log(err))

    }

    return (
        <div className="sign-up-wrapper">
            <AuthTabs title={key} setKey={setKey} />
            <Form onSubmit={handleSubmit}>
                <Form.Group className="auth-form-wrapper">
                    {
                        key === "signUp" && (
                            <>
                                <Form.Row>
                                    <Form.Label column="lg" lg={12}>
                                        First name
                                 </Form.Label>
                                    <Col>
                                        <Form.Control ref={firstNameEl} size="lg" type="text" placeholder="First name" />
                                    </Col>
                                </Form.Row>
                                <br />
                                <Form.Row>
                                    <Form.Label column="lg" lg={12}>
                                        Last name
                                </Form.Label>
                                    <Col>
                                        <Form.Control ref={lastNameEl} size="lg" type="text" placeholder="Last name" />
                                    </Col>
                                </Form.Row>
                                <br />
                            </>
                        )
                    }
                    <Form.Row>
                        <Form.Label column="lg" lg={12}>
                            Email address
                </Form.Label>
                        <Col>
                            <Form.Control ref={emailEl} size="lg" type="text" placeholder="Email address" />
                        </Col>
                    </Form.Row>
                    <br />
                    <Form.Row>
                        <Form.Label column="lg" lg={12}>
                            Password
                </Form.Label>
                        <Col>
                            <Form.Control ref={passwordEl} size="lg" type="password" placeholder="Password" />
                        </Col>
                    </Form.Row>
                    <br />
                    <div className="button-wrapper">
                        <Button
                            type="submit"
                            size="lg"
                            className="app-btn"
                        >
                            {key === "signIn" ? "Login" : "Sign up"}
                        </Button>
                    </div>
                </Form.Group>
            </Form>

        </div>
    )
}

export default SignUp
import React from "react";
import { useDispatch } from 'react-redux';
import { login } from '../../store/session';
import './DemoLoginButton.css'

function DemoLoginButton() {
    const dispatch = useDispatch();

    const onSubmit = async e => {
        e.preventDefault();
        const email = "demo@demoemail.com"
        const password = "password"
        await dispatch(login(email, password));
    }

    return (
        <form onSubmit={onSubmit}>
            <button id="demo-login" type="submit">Demo Log In</button>
        </form>
    )
}

export default DemoLoginButton

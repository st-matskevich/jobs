import './LoginRoute.scss';
import { useState, useEffect } from 'react';
import firebase from "firebase";

const LoginStages = {
    Phone: 0,
    SMS: 1
}

function LoginRoute(props) {

    const [loading, setLoading] = useState(false);
    const [loginStage, setLoginStage] = useState(LoginStages.Phone);
    const [usetInput, setUserInput] = useState("");

    useEffect(() => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('captcha', {
            'size': 'invisible',
        });
    }, []);

    function SignIn() {
        setLoading(true);
        firebase.auth().signInWithPhoneNumber(usetInput, window.recaptchaVerifier)
            .then(function (confirmationResult) {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                setUserInput("")
                setLoginStage(LoginStages.SMS);
                setLoading(false);
                console.log("SMS send");
            }).catch(function (error) {
                // Error; SMS not sent
                setLoading(false);
                console.error(error);
            });

    }

    function ConfirmCode() {
        setLoading(true);
        window.confirmationResult.confirm(usetInput).then(function (result) {
            // User signed in successfully.
            setLoading(false);
            console.log("Signed in");
        }).catch(function (error) {
            // User couldn't sign in (bad verification code?)
            setLoading(false);
            console.error(error);
        });

    }

    function SubmitForm() {
        if (loginStage === LoginStages.Phone)
            SignIn();
        else
            ConfirmCode();
    }

    return (
        <div className="login-card">
            <div className="title">jobs</div>
            <div id="captcha"></div>
            { props.loading || loading ?
                <div className="loader-wrapper">
                    <div className="login-loader"></div>
                </div>
                :
                <form className="login-form" onSubmit={SubmitForm}>
                    <input className="underline-input" type="text"
                        placeholder={loginStage === LoginStages.Phone ? "введите номер телефона" : "введите код из смс"}
                        value={usetInput} onChange={(event) => {
                            setUserInput(event.target.value)
                        }} />
                    <input type="submit" className="button" value="Продолжить" />
                </form>
            }
        </div>
    );
}

export default LoginRoute;
import './LoginRoute.scss';
import { useState, useEffect } from 'react';
import firebase from "../api/firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import { RecaptchaVerifier } from "firebase/auth";

const LoginStages = {
    Phone: 0,
    SMS: 1
}

function LoginRoute(props) {

    const [loading, setLoading] = useState(false);
    const [loginStage, setLoginStage] = useState(LoginStages.Phone);
    const [usetInput, setUserInput] = useState("");

    useEffect(() => {
        window.recaptchaVerifier = new RecaptchaVerifier('captcha', {
            'size': 'invisible',
          }, firebase.GetAuth());
    }, []);

    function SignIn() {
        setLoading(true);
        signInWithPhoneNumber(firebase.GetAuth(), usetInput, window.recaptchaVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setUserInput("")
                setLoginStage(LoginStages.SMS);
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                console.log(error);
            });

    }

    function ConfirmCode() {
        setLoading(true);
        window.confirmationResult.confirm(usetInput).then(() => {
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            console.log(error);
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
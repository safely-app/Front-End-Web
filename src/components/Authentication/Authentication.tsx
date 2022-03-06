import React, { useEffect, useState } from 'react';
import { TextInput, Button } from '../common';
import { Redirect } from 'react-router-dom';
import {
    disconnect,
    setCredentials,
    useAppSelector,
    useAppDispatch
} from '../../redux';
import { notifyError } from '../utils';
import { User } from '../../services';
import { ToastContainer } from 'react-toastify';
import { GoogleLogin } from 'react-google-login';
import 'react-toastify/dist/ReactToastify.css';
import './Authentication.css';
import log from 'loglevel';
import logo from '../../assets/image/logo.png'
import google from '../../assets/image/google_logo.jpg'

enum View {
    SIGNIN,
    SIGNUP,
    FORGOT
}

const responseGoogle = (response) => {
    /*if (response ) {
      axios.get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + response.tokenId)
        .then(function(res) {
          axios.post("apiurl", {"email": res.data.email, "id": response.tokenObj.login_hint, "token": "abcd", "deviceType": "web"})
          .then(function(result) {
            //this.showNotif("Bienvenue", "Vous êtes connectés", "green")
            localStorage.setItem("Token", result.headers.authorization)
            localStorage.setItem("Username", res.data.given_name)
            window.location.reload(false);
          })
        })
        .catch(function() {
          //showNotif("Erreur", "Mauvaise combinaison identifiants/mot de passe", "red-500")
      })
   }*/
  }

interface IAuthProps {
    setView: (value: View) => void;
}

const SignInView: React.FC<IAuthProps> = ({
    setView
}) => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState("");

    const handleClick = async () => {
        try {
            const response = await User.login(email, password);

            dispatch(setCredentials(response.data));
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex bg-background-auth bg-cover bg-center">
          <div className="hidden lg:block relative w-0 flex-1">
            <div className="absolute inset-20 w-full object-cover">
              <p className="font-extrabold uppercase text-yellow-200 text-5xl mb-2">Bienvenue sur Safely</p>
              <p className="font-normal uppercase text-yellow-200 text-xl">L'application qui sécurise vos déplacements</p>
              <button onClick={() => setView(View.SIGNUP)} className="font-medium text-white uppercase text-2xl ring-3 ring-gray border border-gray rounded-3xl pt-2 pb-2 pl-12 pr-12 hover:text-yellow-200 hover:border-yellow-200 mt-10 focus:outline-none">S'inscrire</button>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 lg:bg-opacity-90 flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div>
                <img
                  className="h-44 w-auto ml-auto mr-auto"
                  src={logo}
                  alt="Logo Safely"
                />
                <h2 className="mt-6 text-3xl font-extrabold text-gray">Se connecter</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Ou {' '}
                  <button onClick={() => setView(View.SIGNUP)} className="font-medium text-red-500 hover:text-red-500 cursor-pointer">
                    S'inscrire
                  </button>
                </p>
              </div>
              <div className="mt-8">
                <div className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="mt-1">
                        <TextInput
                            value={email}
                            setValue={setEmail}
                            //onChange={this.handleChange}
                            name="email"
                            type="email"
                            role="email"
                            label="Email"
                            required-500
                            className="appearance-none block w-full px-3 py-2 border-2 border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-transparent sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Mot de passe
                      </label>
                      <div className="mt-1">
                        <TextInput
                            value={password}
                            setValue={setPassword}
                            name="password"
                            type="password"
                            role="password"
                            label="Mot de passe"
                            required-500
                            className="appearance-none block w-full px-3 py-2 border-2 border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-transparent sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TextInput
                            value={remember}
                            setValue={setRemember}
                            name="remember_me"
                            type="checkbox"
                            className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                          Rester connecté
                        </label>
                      </div>
                      <div className="text-sm">
                        <button onClick={() => setView(View.FORGOT)} className="font-medium text-red-500 hover:text-red-500 cursor-pointer">
                        Mot de passe oublié ?
                        </button>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={handleClick}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-3xl shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Se connecter
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="mt-6 mb-6 relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-transparent lg:border-gray" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 lg:bg-white bg-none text-gray font-normal">Ou se connecter avec</span>
                    </div>
                  </div>
                <div>
                    <div className="mt-1 grid grid-cols-2 gap-6 text-center ">
                      <div className="text-right focus:outline-none">
                      <div
                          className="cursor-pointer w-24 inline-flex justify-center py-2 px-4 border-2 border-white rounded-3xl shadow-sm bg-white text-sm font-medium hover:border-red-500 "
                        >
                          <span className="sr-only">Sign in with Google</span>
                          <GoogleLogin
                            clientId="409852833093-r8n4tmddotipm85c153kn45hq9i42d78.apps.googleusercontent.com"
                            render={renderProps => (
                              <button className="focus:outline-white ring-white" onClick={renderProps.onClick} disabled={renderProps.disabled}><img alt="google logo" className="focus:outline-white ring-white" src={google} /></button>
                            )}
                            buttonText="Login"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
    );
}

const SignUpView: React.FC<IAuthProps> = ({
    setView
}) => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const handleClick = async () => {
        try {
            const response = await User.register({
                id: "",
                role: "",
                email: email,
                username: username,
                password: password,
                confirmedPassword: confirmedPassword
            });

            dispatch(setCredentials(response.data));
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex bg-background-auth bg-cover bg-center">
          <div className="hidden lg:block relative w-0 flex-1">
            <div className="absolute inset-20 w-full object-cover">
              <p className="font-extrabold uppercase text-yellow-200 text-5xl mb-2">Bienvenue sur Safely</p>
              <p className="font-normal uppercase text-yellow-200 text-xl">L'application qui sécurise vos déplacements</p>
              <button onClick={() => setView(View.SIGNIN)} className="font-medium uppercase text-2xl ring-3 ring-gray border border-gray rounded-3xl pt-2 pb-2 pl-12 pr-12 text-white hover:text-yellow-200 hover:border-yellow-200 mt-10 focus:outline-none">Se connecter</button>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 lg:bg-opacity-90 flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div>
                <img
                  className="h-44 w-auto ml-auto mr-auto"
                  src={logo}
                  alt="Logo Safely"
                />
                <h2 className="mt-6 text-3xl font-extrabold text-gray">S'inscrire</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Ou {' '}
                  <button onClick={() => setView(View.SIGNIN)} className="font-medium text-red-500 hover:text-red-500 cursor-pointer">
                    Se connecter
                  </button>
                </p>
              </div>
              <div className="mt-8">
                <div className="mt-6">
                  <div onSubmit={handleClick} className="space-y-6">
                    <div>
                      <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                        Nom d'utilisateur
                      </label>
                      <div className="mt-1">
                        <TextInput
                            value={username}
                            setValue={setUsername}
                            name="username"
                            type="username"
                            role="username"
                            label="Nom d'utilisateur"
                            required-500
                            className="appearance-none block w-full px-3 py-2 border-2 border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-transparent sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="mt-1">
                        <TextInput
                            value={email}
                            setValue={setEmail}
                            name="email"
                            type="email"
                            role="email"
                            label="Email"
                            autoComplete="email"
                            required
                            className="appearance-none block w-full px-3 py-2 border-2 border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-transparent sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Mot de passe
                      </label>
                      <div className="mt-1">
                        <TextInput
                            value={password}
                            setValue={setPassword}
                            name="password"
                            type="password"
                            role="password"
                            label="Mot de passe"
                            autoComplete="current-password"
                            required
                            className="appearance-none block w-full px-3 py-2 border-2 border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-transparent sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Répeter le mot de passe
                      </label>
                      <div className="mt-1">
                        <TextInput
                            value={confirmedPassword}
                            setValue={setConfirmedPassword}
                            name="confirmedPassword"
                            type="password"
                            role="password"
                            label="Répeter le mot de passe"
                            autoComplete="current-password"
                            required
                            className="appearance-none block w-full px-3 py-2 border-2 border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-transparent sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={handleClick}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-3xl shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red"
                      >
                        S'inscrire
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="mt-6 mb-6 relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-transparent lg:border-gray" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 lg:bg-white bg-none text-gray font-normal">Ou se connecter avec</span>
                    </div>
                  </div>
                  <div>
                    <div className="mt-1 grid grid-cols-2 gap-6 text-center ">
                      <div className="text-right focus:outline-none">
                      <div
                          className="cursor-pointer w-24 inline-flex justify-center py-2 px-4 border-2 border-white rounded-3xl shadow-sm bg-white text-sm font-medium hover:border-red-500 "
                        >
                          <span className="sr-only">Sign in with Google</span>
                          <GoogleLogin
                            clientId="409852833093-r8n4tmddotipm85c153kn45hq9i42d78.apps.googleusercontent.com"
                            render={renderProps => (
                              <button className="focus:outline-white ring-white" onClick={renderProps.onClick} disabled={renderProps.disabled}><img alt="google logo" className="focus:outline-white ring-white" src={google} /></button>
                            )}
                            buttonText="Login"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}

const ForgottenPassword: React.FC = () => {
    const [email, setEmail] = useState("");

    const handleClick = async () => {
        try {
            const response = await User.forgotPassword(email);

            log.log(response);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    return (
        <div className="Authentication-container">
            <div className="Authentication">
                <h1>Mot de passe oublié ?</h1>
                <TextInput type="email" role="email" label="Email" value={email} setValue={setEmail} />
                <Button text="Réinitialiser le mot de passe" onClick={handleClick} />
            </div>
        </div>
    );
}

export const Authentication: React.FC = () => {
    const userCredientialsId = useAppSelector(state => state.user.credentials._id);
    const [view, setView] = useState(View.SIGNIN);

    const selectView = (): JSX.Element => {
        switch (view) {
            case View.SIGNUP:
                return <SignUpView setView={setView} />;
            case View.FORGOT:
                return <ForgottenPassword />;
            default:
                return <SignInView setView={setView} />;
        }
    };

    return (
        <div className="Authentication-container">
            {selectView()}
            {!!userCredientialsId && <Redirect to="/" />}
        </div>
    );
}

export const SignOut: React.FC = () => {
    const dispatch = useAppDispatch();
    const userCredientialsId = useAppSelector(state => state.user.credentials._id);

    useEffect(() => {
        dispatch(disconnect());
    });

    return <div>{!userCredientialsId && <Redirect to="/login" />}</div>;
}

interface ResetProps {
    id: string;
    token: string;
}

export const ResetPassword: React.FC = () => {
    const [redirect, setRedirect] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [resetProps, setResetProps] = useState<ResetProps>({
        id: "",
        token: ""
    });

    const parseUrl = (url: string): ResetProps => {
        const regex = new RegExp("/reset/(.*)/token/(.*)");
        const found = url.match(regex) || ["", ""];

        return {
            id: found[1],
            token: found[2]
        };
    };

    const handleClick = () => {
        try {
            User.changePassword(
                resetProps.id,
                resetProps.token,
                password,
                confirmedPassword
            ).then(response => {
                log.log(response);
                setRedirect(true);
            }).catch(error => {
                log.error(error);
            });
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    useEffect(() => {
        setResetProps(parseUrl(window.location.href));
    }, []);

    return (
        <div className="Authentication">
            <h1>Réinitialiser le mot de passe</h1>
            <TextInput type="password" role="password" label="Mot de passe" value={password} setValue={setPassword} />
            <TextInput type="password" role="password" label="Confirmer mot de passe" value={confirmedPassword} setValue={setConfirmedPassword} />
            <Button text="Réinitialiser" onClick={handleClick} />
            <ToastContainer />
            {redirect && <Redirect to="/login" />}
        </div>
    );
}

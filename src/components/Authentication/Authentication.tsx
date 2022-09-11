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
import { GoogleLogin } from 'react-google-login';
import 'react-toastify/dist/ReactToastify.css';
import './Authentication.css';
import log from 'loglevel';
import logo from '../../assets/image/logo.png'
import google from '../../assets/image/google_logo.jpg'
import {
  isEmailValid,
  isPasswordValid,
  isUsernameValid,
  isUserValid
} from '../../services/utils';
import { FaCircle } from 'react-icons/fa';

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
  const [tries, setTries] = useState(0);

  const handleClick = async () => {
    try {
      const response = await User.login(email, password);

      dispatch(setCredentials(response.data));
    } catch (e: any) {
      if (e.response && e.response.status === 401) {
        notifyError("Email et/ou mot de passe invalide");
      } else notifyError(e);
    }

    setEmail("");
    setPassword("");
    setRemember("");
    setTries(tries + 1);
    log.log(remember);
  };

  const getInvalidInputClassName = (cond: boolean) => {
    if (cond || tries < 1)
      return "";
    return "outline-none border-red-500 ring-transparent";
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen">
      <img
        className="h-20 w-auto ml-auto mr-auto mt-20 mb-3"
        src={logo}
        alt="Logo Safely"
      />
      <p className="font-black text-2xl mb-3">Connexion</p>
      <div
        className="cursor-pointer w-16 inline-flex justify-center py-2 px-4 border-2 border-white rounded-3xl shadow-sm bg-white text-sm font-medium hover:border-red-500 "
      >
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
      <div className="flex flex-row items-center justify-center mt-3">
        <div className="w-24 border-b-2 h-2 mr-3" />
        <p>OU</p>
        <div className="w-24 border-b-2 h-2 ml-3" />
      </div>
      <div className="w-64">
        <TextInput
          onKeyPress={(e) => e.key === "Enter" && handleClick()}
          value={email}
          setValue={setEmail}
          name="email"
          type="email"
          role="email"
          label="Email"
          required-500
          className={`appearance-none block mt-5 w-full px-3 py-2 bg-[#EAF1F9] rounded-3xl shadow-sm placeholder-gray-400 sm:text-sm ${getInvalidInputClassName(isEmailValid(email))}`}
        />
      </div>
      <div className="mt-1 w-64">
        <TextInput
          onKeyPress={(e) => e.key === "Enter" && handleClick()}
          value={password}
          setValue={setPassword}
          name="password"
          type="password"
          role="password"
          label="Mot de passe"
          required-500
          className={`appearance-none block w-full px-3 py-2 bg-[#EAF1F9] rounded-3xl shadow-sm placeholder-gray-400 sm:text-sm ${getInvalidInputClassName(isPasswordValid(password))}`}
        />
      </div>
      <div className="mt-5 w-60">
        <button
          onClick={handleClick}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-3xl shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Se connecter
        </button>
      </div>
      <div className="text-sm flex flex-col">
        <button onClick={() => setView(View.FORGOT)} className="mt-5 font-normal text-red-500 hover:text-red-500 cursor-pointer">
          Réinitialiser votre mot de passe
        </button>
        <button onClick={() => setView(View.SIGNUP)} className="mt-3 mb-3 font-normal text-red-500 hover:text-red-500 cursor-pointer">
          Vous n'avez pas de compte ?
        </button>
      </div>
      <div className="flex flex-col">
        <div className="w-96 border-b-2 h-2" />
        <div className="flex flex-row">
          <p className="underline text-sm text-gray-500">Téléchargez l'application</p>
          <FaCircle style={{ color: 'lightgray' }} className="ml-2 mt-2" size={7} />
          <p className="underline text-sm text-gray-500 ml-2">Nous contacter</p>
        </div>
      </div>
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
  const [tries, setTries] = useState(0);

  const handleClick = async () => {
    const tmpUser = {
      id: "",
      role: "",
      email: email,
      username: username,
      password: password,
      confirmedPassword: confirmedPassword
    };

    try {
      const response = await User.register(tmpUser);

      dispatch(setCredentials(response.data));
    } catch (e: any) {
      if (e.response && e.response.status === 401)
        notifyError(isUserValid(tmpUser).error);
      else notifyError(e);
    }

    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmedPassword("");
    setTries(tries + 1);
  };

  const getInvalidInputClassName = (cond: boolean) => {
    if (cond || tries < 1)
      return "";
    return "outline-none border-red-500 ring-transparent";
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen">
      <img
        className="h-20 w-auto ml-auto mr-auto mt-20 mb-3"
        src={logo}
        alt="Logo Safely"
      />
      <p className="font-black text-2xl mb-3">Inscription</p>
      <div
        className="cursor-pointer w-16 inline-flex justify-center py-2 px-4 border-2 border-white rounded-3xl shadow-sm bg-white text-sm font-medium hover:border-red-500 "
      >
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
      <div className="flex flex-row items-center justify-center mt-3">
        <div className="w-24 border-b-2 h-2 mr-3" />
        <p>OU</p>
        <div className="w-24 border-b-2 h-2 ml-3" />
      </div>
      <div className="w-64">
        <TextInput
          onKeyPress={(e) => e.key === "Enter" && handleClick()}
          value={username}
          setValue={setUsername}
          name="username"
          type="username"
          role="username"
          label="Nom d'utilisateur"
          required-500
          className={`appearance-none block w-full mt-5 px-3 py-2 bg-[#EAF1F9] rounded-3xl shadow-sm placeholder-gray-400 sm:text-sm ${getInvalidInputClassName(isUsernameValid(username))}`}
        />
      </div>
      <div className="mt-1 w-64">
        <TextInput
          onKeyPress={(e) => e.key === "Enter" && handleClick()}
          value={email}
          setValue={setEmail}
          name="email"
          type="email"
          role="email"
          label="Email"
          required-500
          className={`appearance-none block w-full px-3 py-2 bg-[#EAF1F9] rounded-3xl shadow-sm placeholder-gray-400 sm:text-sm ${getInvalidInputClassName(isEmailValid(email))}`}
        />
      </div>
      <div className="mt-1 w-64">
        <TextInput
          onKeyPress={(e) => e.key === "Enter" && handleClick()}
          value={password}
          setValue={setPassword}
          name="password"
          type="password"
          role="password"
          label="Mot de passe"
          required-500
          className={`appearance-none block w-full px-3 py-2 bg-[#EAF1F9] rounded-3xl shadow-sm placeholder-gray-400 sm:text-sm ${getInvalidInputClassName(isPasswordValid(password))}`}
        />
      </div>

      <div className="mt-1 w-64">
        <TextInput
          onKeyPress={(e) => e.key === "Enter" && handleClick()}
          value={confirmedPassword}
          setValue={setConfirmedPassword}
          name="confirmedPassword"
          type="password"
          role="password"
          label="Répeter le mot de passe"
          autoComplete="current-password"
          required
          className={`appearance-none block w-full px-3 py-2 bg-[#EAF1F9] rounded-3xl shadow-sm placeholder-gray-400 sm:text-sm ${getInvalidInputClassName(isPasswordValid(confirmedPassword))}`}
        />
      </div>

      <div className="mt-5 w-60">
        <button
          onClick={handleClick}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-3xl shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red"
        >
          S'inscrire
        </button>
      </div>
      <div className="text-sm flex flex-col">
        <button onClick={() => setView(View.FORGOT)} className="mt-5 font-normal text-red-500 hover:text-red-500 cursor-pointer">
          Réinitialiser votre mot de passe
        </button>
        <button onClick={() => setView(View.SIGNIN)} className="mt-3 mb-3 font-normal text-red-500 hover:text-red-500 cursor-pointer">
          Se connecter
        </button>
      </div>
      <div className="flex flex-col">
        <div className="w-96 border-b-2 h-2" />
        <div className="flex flex-row">
          <p className="underline text-sm text-gray-500">Téléchargez l'application</p>
          <FaCircle style={{ color: 'lightgray' }} className="ml-2 mt-2" size={7} />
          <p className="underline text-sm text-gray-500 ml-2">Nous contacter</p>
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
      notifyError(e);
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
      {!!userCredientialsId &&
        <Redirect to={(view === View.SIGNUP) ? "/?onboarding=true" : "/"} />
      }
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
    const found = url.match(regex) || ["", "", ""];

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
      notifyError(e);
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
      {redirect && <Redirect to="/login" />}
    </div>
  );
}

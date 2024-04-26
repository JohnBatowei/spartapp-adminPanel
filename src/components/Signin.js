import { useState } from "react";
import { useHistory } from "react-router-dom";
import { X } from "react-bootstrap-icons";
import { useAuthContext } from "../hooks/useAuthContext";
import "./css/sign.scss";

// ... imports

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const { dispatch } = useAuthContext();
  const history = useHistory();

  const HandleSubmit = async (event) => {
    event.preventDefault();

    try {
      const Form = { email: email, password: password };
      const formBody = JSON.stringify(Form);

      const connection = "http://localhost:3800/verify" || "";
      const result = await fetch(connection, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formBody,
      });

      // console.log(result);
      // console.log(result.headers);
      // console.log(result.status);

      const data = await result.json();

      if (!result.ok) {
        // setErrMsg(data.message);
        throw new Error(data.message);
      } else {
        setEmail(""); // Clear the email or consider whether you want to retain it
        setPassword("");
        dispatch({ type: "LOGIN", payload: data });
        localStorage.setItem("admin", JSON.stringify(data));
        history.push("/admin");
      }
    } catch (error) {
      console.error(error.message);
      setErrMsg(error.message)

    }
  };

  const HandleError = () => {
    setErrMsg("");
  };

  return (
    <div className="signin">
      <div className={`message ${errMsg ? "greenM" : ""}`}>
        {errMsg}
        <X
          style={{ marginLeft: "28px", marginTop: "-12px", cursor: "pointer" }}
          onClick={HandleError}
        />
      </div>

      <form onSubmit={HandleSubmit}>
        <h3>SpartApp Admin Login</h3>
        <div className="container">
          <div className="inputs">
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              autoComplete="off"
              value={email}
              onChange={(event) => {
                setEmail(event.currentTarget.value);
              }}
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
              required
            />
          </div>
          <button>Login</button>
        </div>
      </form>
    </div>
  );
};

export default Signin;

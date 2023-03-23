import React from "react";
import { useState } from "react";
import { supabase } from "../../api/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpPage, setSignUpPage] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (signUpPage) {
      try {
        setLoading(true);
        // const { error } = await supabase.auth.signInWithOtp({ email });
        const sigUpAction = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if (sigUpAction.error) throw sigUpAction.error;

        alert("Check your email for the login link!");
      } catch (error) {
        alert(error.error_description || error.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw error;
      } catch (error) {
        alert(error.error_description || error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className=" flex bg-gray-100 justify-center  h-screen w-screen">
      <div className="bg-white border-4 self-center justify-center flex flex-col w-7/12 h-3/6 ">
        <div className="self-center justify-self-center" aria-live="polite">
          <h1 className="header">Supabase + React</h1>

          <p className="description">Sign in to your account</p>
          {loading ? (
            signUpPage ? (
              "Sending magic link..."
            ) : (
              "logging in"
            )
          ) : (
            <div className="flex">
              <form onSubmit={handleLogin}>
                <div
                  className="flex-col
                  justify-center
                "
                >
                  <div>
                    <label htmlFor="email">Your email</label>
                    <br />
                    <input
                      id="email"
                      className="inputField login-input"
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div></div>

                  <label htmlFor="password">Password</label>
                  <br />

                  <input
                    id="password"
                    className="inputField login-input"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button className="button block" aria-live="polite">
                  {signUpPage ? "Sign Up" : "Login"}
                </button>
              </form>

            </div>
          )}
        </div>
        <button className="text-center self-center" onClick={() => setSignUpPage(signUpPage ? false : true)}>
                {signUpPage ? "Login" : "Go to sign Up"}
              </button>
      </div>
    </div>
  );
}

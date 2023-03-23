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
      <div
        className=" bg-white border-4  w-5/12 h-5/6 self-center flex justify-center"
        aria-live="polite"
      >
        {loading ? (
          signUpPage ? (
            "Sending magic link..."
          ) : (
            "logging in"
          )
        ) : (
          <div className="flex flex-col self-center w-4/5 ">
            <div className="">
              <h1 className="header">Supabase + React</h1>

              <p className="description font-bold text-lg">
                Sign in to your account
              </p>
            </div>

            <br />
            <form onSubmit={handleLogin}>
              <div className="flex flex-col ">
                <div className="">
                  <label htmlFor="email">Your email</label>
                  <br />
                  <input
                    id="email"
                    className="inputField auth-input"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <br />
                <div>
                  <label htmlFor="password">Password</label>
                <br />

                  <input
                    id="password"
                    className="inputField auth-input"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <br />
              <button
                className="button block bg-sky-400 text-white border-sky-200 rounded-md p-1 w-full"
                aria-live="polite"
              >
                {signUpPage ? "Sign Up" : "Login"}
              </button>
              <p className="my-1">
                {signUpPage ? "Go to login" : "Don’t have an account yet?"}{" "}
                <button
                  className="text-center text-sky-400"
                  onClick={(e) => {
                    setSignUpPage(signUpPage ? false : true);
                    e.preventDefault();
                  }}
                >
                  {signUpPage ? "Login" : "Sign Up"}
                </button>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

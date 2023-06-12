import React from "react";
import { useState } from "react";
import { supabase } from "../../api/supabaseClient";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpPage, setSignUpPage] = useState(false);

  const handleSignUpAndLogin = async (e) => {
    e.preventDefault();
    // this fn is to handle the login and sign up event. Depending on 
    //the state of signUpPage. if true, using signUp method of supabase. 
    //Otherwise, using signInWithPassword to login.
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
  async function visitorLogin() {
    try {
      setLoading(true);
      // const { error } = await supabase.auth.signInWithOtp({ email });
      const sigUpAction = await supabase.auth.signInWithPassword({
        email: `${import.meta.env.VITE_Vistor_email}`,
        password: `${import.meta.env.VITE_Vistor_Password}`,
      });
      if (sigUpAction.error) throw sigUpAction.error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className=" flex bg-gray-100 justify-center  h-screen w-screen">
      <div
        className=" bg-white border-4 max-h-[700px] max-w-[800px] w-4/6 h-5/6 self-center flex justify-center "
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
              <h1 className="header">Stock Chart</h1>

              <p className="description font-bold text-lg">
                {signUpPage ? "Sign up" : "Sign in to your account"}
              </p>
            </div>

            <br />
            <form onSubmit={handleSignUpAndLogin}>
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
                className={`${
                  signUpPage
                    ? "bg-purple-600 hover:bg-purple-500"
                    : "bg-sky-400 hover:bg-sky-300"
                }  block  text-white border-sky-200 border-2 rounded-md p-1 w-full`}
                aria-live="polite"
              >
                {signUpPage ? "Sign Up" : "Login"}
              </button>
              <p className="my-1">
                {signUpPage ? "Go to " : "Don’t have an account yet?"}{" "}
                <button
                  className={`text-center ${
                    signUpPage ? "text-purple-600 " : "text-sky-400"
                  }`}
                  onClick={(e) => {
                    setSignUpPage(signUpPage ? false : true);
                    e.preventDefault();
                  }}
                >
                  {signUpPage ? "Login" : "Sign Up"}
                </button>
              </p>
              {signUpPage ? null : (
                <p>
                  Use{" "}
                  <>
                    <button
                      title="Hi! I'm tooltip"
                      onClick={visitorLogin}
                      className="text-sky-400"
                    >
                      Public Visitor Mode{" "}

                    </button>
                    <span title="This mode allow you to login in by a public account. All the data in the account could be shared, viewed and changed by anyone.">
                        <HelpOutlineIcon />
                      </span>
                  </>
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

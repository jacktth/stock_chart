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
    if(signUpPage){
      try {
        setLoading(true);
        // const { error } = await supabase.auth.signInWithOtp({ email });
        const sigUpAction = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        // if (error) throw error;
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
        })
        console.log("gets",supabase.auth.getUser().then(({ data: { user } })=>user))
        if (error) throw error;
      } catch (error) {
        alert(error.error_description || error.message);
      } finally {
        setLoading(false);
      }
    }
  
  };

  return (
    <div className="row flex-center flex">
      <div className="col-6 form-widget" aria-live="polite">
        <h1 className="header">Supabase + React</h1>
        <p className="description">
          Sign in via magic link with your email below
        </p>
        {loading ? 
             signUpPage ? "Sending magic link..." : "logging in"
        : (
          <div>
            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                id="password"
                className="inputField"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="button block" aria-live="polite">
                {signUpPage ? "Sign Up" : "Login"}
              </button>
            </form>
            <button onClick={()=>setSignUpPage(signUpPage ?false :true)}>
            {signUpPage ?  "Login": "Go to sign Up"}

            </button>
          </div>
        )}
      </div>
    </div>
  );
}

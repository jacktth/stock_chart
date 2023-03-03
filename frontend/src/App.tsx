import { AuthError, Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { supabase } from "./api/supabaseClient";
import Auth from "./features/auth/Auth";
import { Chart } from "./features/chart/Chart";

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<AuthError  | null>(null)
  useEffect(() => {
    if(window.location.href.includes("Email+link+is+invalid+or+has+expired")){
      alert("the email link is invalid or has expired, please enter correct link or sign up again if possible")
    }
  
    supabase.auth.getSession().then(({ data: { session },error }) => {
      setSession(session)
     
    })

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })
  }, [])

  return !session ?<Auth/> :<Chart /> ;
}

export default App;

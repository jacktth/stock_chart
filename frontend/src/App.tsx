import { AuthError, Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { supabase } from "./api/supabaseClient";
import Auth from "./features/auth/Auth";
import { Chart } from "./features/chart/Chart";
const queryClient = new QueryClient()
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

  // return !session ?<Auth/> :<QueryClientProvider client={queryClient}><Chart /></QueryClientProvider> ;
  return <QueryClientProvider client={queryClient}><Chart /></QueryClientProvider> ;
}

export default App;

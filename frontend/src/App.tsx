import { Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { supabase } from "./api/supabaseClient";
import Auth from "./features/auth/Auth";
import { Chart } from "./features/chart/Chart";

function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session },error }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return !session ?<Auth/> :<Chart /> ;
}

export default App;

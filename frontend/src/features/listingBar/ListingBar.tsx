import React from "react";

import { Session } from "@supabase/supabase-js";
import { SaveBar } from "./SaveBar";
import SymbolsList from "./symbolsList";
import CategoricalList from "./CategoricalList";

export function ListingBar({ session }: { session: Session }) {
  //this is the parent component and the left side bar
  return (
    <div className="h-full">
      <CategoricalList session={session} />
      <SaveBar session={session} />
      <SymbolsList session={session} />
    </div>
  );
}

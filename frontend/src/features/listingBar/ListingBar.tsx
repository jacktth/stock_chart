import React from "react";

import { Session } from "@supabase/supabase-js";
import { CategoricalList } from "./CategoricalList";
import { SymbolList } from "./SymbolsList";
import { SaveBar } from "./SaveBar";

export function ListingBar({ session }: { session: Session }) {
  //this is the parent component and the left side bar
  return (
    <div className="h-full">
      <CategoricalList session={session} />
      <SaveBar session={session} />
      <SymbolList session={session} />
    </div>
  );
}

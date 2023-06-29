import React from "react";

import { Session } from "@supabase/supabase-js";
import SymbolsList from "./symbolsList";
import CategoricalList from "./CategoricalList";
import SaveBar from "./saveBar";

const ListingBar= ({ session }: { session: Session }) => {
  //this is the parent component and the left side bar
  return (
    <div className="h-full">
      <CategoricalList session={session} />
      <SaveBar session={session} />
      <SymbolsList session={session} />
    </div>
  );
}

export default ListingBar;
import {createContext, useState} from "react";

interface ISidebarContext {
    selected: number;
    setSelected: (selected: number) => void;
}

export const SidebarContext = createContext<ISidebarContext>({} as ISidebarContext);

export const IndexContext = (props: any) => {
    const [selected, setSelected] = useState<number>(0);
    return (
        <SidebarContext.Provider value={{selected, setSelected}}>
            {props.children}
        </SidebarContext.Provider>
    )
}
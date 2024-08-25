import { createContext } from "react";

const userContext = createContext({
    user: {
        name: "Shree Radha",
        email: "radhanikunjexpress@shyaamsundar.com",
        jaykara: "Jai Jai Shree Radhey....... Shyaam",
        sharangat_mantra: "Radha Vallabh Shri Harivansha",
        powerfull_manter: "Radha... Radha... Radha..."

    }
});

userContext.displayName = 'userContext'

export default userContext;
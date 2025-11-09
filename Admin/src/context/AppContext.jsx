import React, { createContext } from "react";
export const AppContext = createContext()

const AppContextProvider = (props) =>{

    const currency = 'NRs.'

    const calculateAge = (dob) =>{
        const today = new Date()

        const birthDate = new Date(dob)

        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }
      const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Format the slot date properly
  const slotDateFormat = (slotDate) => {
  if (!slotDate || typeof slotDate !== "string") {
    return "N/A"; // or return an empty string if you prefer
  }

  const dateArray = slotDate.split("_");

  // Ensure we have at least three parts before formatting
  if (dateArray.length < 3) {
    return slotDate; // fallback to raw value
  }

  return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
};

    const value ={
        calculateAge,
        slotDateFormat,
        currency

    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )


}

export default AppContextProvider
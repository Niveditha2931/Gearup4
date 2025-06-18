import { createContext,useState } from "react";
export const userAuthorContextObj=createContext();

function UserAdmin({children}) {
    let[currentUser,setCurrentUser]=useState({
        firstName:'',
        lastName:'',
        email:"",
        profileImageUrl:'',
        role:''
      })
        return (
        <div>
          <userAuthorContextObj.Provider value={{currentUser,setCurrentUser}}>
            {children}
          </userAuthorContextObj.Provider>
        </div>
      )
  
}

export default UserAdmin



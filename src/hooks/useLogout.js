import { useAuthContext } from "./useAuthContext";


export const useLogout = ()=>{
   const { dispatch } = useAuthContext()

   const logout = ()=>{
    // remove user from storage
    localStorage.removeItem('admin')

    // dispatch logout action
    dispatch({type: 'LOGOUT'})
   }

   return {logout}
}

// import { useAuthContext } from "./useAuthContext";
// import Cookies from 'js-cookie';

// export const useLogout = ()=>{
//    const { dispatch } = useAuthContext()

//    const logout = ()=>{
//     // remove user from storage
//     localStorage.removeItem('admin')

//     // delete JWT cookie
//     Cookies.remove('token')

//     // dispatch logout action
//     dispatch({type: 'LOGOUT'})
//    }

//    return {logout}
// }

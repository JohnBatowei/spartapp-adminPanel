import { useState } from "react"
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './css/dashboard.scss'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useAuthContext } from "../hooks/useAuthContext";
import {useLogout} from "../hooks/useLogout";
import AsideBar from "./pages/AsideBar";
import Advertisement from './pages/Advertisement';
import HeroSection from './pages/HeroSection';
import ViewSite from './pages/ViewSite';
import CreateStore from './pages/CreateStore';
import CreateCategory from './pages/CreateCategory';
import OfficialStore from './pages/OfficialStore';
import Settings from './pages/Settings';
import Subscribers from './pages/Subscribers';
import Users from './pages/Users';
import Feedbacks from './pages/Feedbacks';
import Product from './pages/Product';
import Orders from './pages/Orders';
import FlashSales from './pages/FlashSales';

const Dashboard = ()=>{
// const data = localStorage.getItem('admin')
const { admin } = useAuthContext();
const { logout } = useLogout()
const [activeItem, setActiveItem] = useState('HeroSection'); // State to track the active item

const history = useHistory()


const HandleLogout = ()=>{
    // localStorage.removeItem('admin')
    logout()
    // history.push('/')
}

 // Function to set the active item
 const handleItemClick = (item) => {
    setActiveItem(item);
  }
  
return(
    <>
    {
        admin ? 
    <div className="dashboard">
        <AsideBar user={admin} activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="main-field">
        <div className="footer">
         <span>SpartApp Admin</span>   Powered By Givitec LTD
            <div className="logout" onClick={HandleLogout}>Logout</div>
            </div>
        
        <div className="content-field">
           {/* Conditionally render components based on the active item */}
           {activeItem === 'ViewSite' && <ViewSite />}
              {activeItem === 'HeroSection' && <HeroSection token={admin.token} />}
              {activeItem === 'CreateCategory' && <CreateCategory token={admin.token} />}
              {activeItem === 'CreateStore' && <CreateStore token={admin.token} />}
              {activeItem === 'OfficialStore' && <OfficialStore token={admin.token} />}
              {activeItem === 'Advertisement' && <Advertisement token={admin.token}/>} 
              {activeItem === 'FlashSales' && <FlashSales token={admin.token}/>} 
              {activeItem === 'Orders' && <Orders token={admin.token}/>} 
              {activeItem === 'Product' && <Product token={admin.token}/>} 
              {activeItem === 'Feedbacks' && <Feedbacks token={admin.token}/>} 
              {activeItem === 'Users' && <Users token={admin.token}/>} 
              {activeItem === 'Subscribers' && <Subscribers token={admin.token}/>} 
              {activeItem === 'Settings' && <Settings token={admin.token}/>} 
              
            {/* <Switch>
            <Route path="/dashboard/viewsite" component={ViewSite} />
            <Route path="/dashboard/herosection" component={HeroSection} />
            <Route path="/dashboard/createstore" component={CreateStore} />
            <Route path="/dashboard/officialstore" component={OfficialStore} />
            <Route path="/dashboard/advertisement" component={Advertisement} />
          </Switch> */}
        </div>
      
      </div>
    </div>
    : history.push('/')
    }
    </>
)
}

export default Dashboard
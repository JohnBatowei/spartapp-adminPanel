import '../css/asideBar.scss'
const AsideBar = (props) => {
    const admin = props.user;
    const activeItem = props.activeItem;
    const onItemClick = props.onItemClick;
    return ( 
        <div className="aside-bar">
            <div className="img">
                <h2>{admin.name}</h2>
                <img src={admin.image} alt="" />
            </div>

        <div className="scrollable-aside">
        <a href='http://www.givitec.com' rel="noreferrer" target='_blank' className={`box ${activeItem === 'ViewSite' ? 'active' : ''}`} onClick={() => onItemClick('ViewSite')}>view site</a>
        <div className={`box ${activeItem === 'HeroSection' ? 'active' : ''}`} onClick={() => onItemClick('HeroSection')}>hero section</div>
        <div className={`box ${activeItem === 'CreateCategory' ? 'active' : ''}`} onClick={() => onItemClick('CreateCategory')}>create category</div>
        <div className={`box ${activeItem === 'CreateStore' ? 'active' : ''}`} onClick={() => onItemClick('CreateStore')}>create store</div>
        <div className={`box ${activeItem === 'OfficialStore' ? 'active' : ''}`} onClick={() => onItemClick('OfficialStore')}>official store</div>
        <div className={`box ${activeItem === 'Advertisement' ? 'active' : ''}`} onClick={() => onItemClick('Advertisement')}>advertisement page</div>
        <div className={`box ${activeItem === 'FlashSales' ? 'active' : ''}`} onClick={() => onItemClick('FlashSales')}>FlashSales page</div>
        <div className={`box ${activeItem === 'Orders' ? 'active' : ''}`} onClick={() => onItemClick('Orders')}>Orders page</div>
        <div className={`box ${activeItem === 'Product' ? 'active' : ''}`} onClick={() => onItemClick('Product')}>Product page</div>
        <div className={`box ${activeItem === 'Feedbacks' ? 'active' : ''}`} onClick={() => onItemClick('Feedbacks')}>Feedbacks page</div>
        <div className={`box ${activeItem === 'Users' ? 'active' : ''}`} onClick={() => onItemClick('Users')}>Users page</div>
        <div className={`box ${activeItem === 'Subscribers' ? 'active' : ''}`} onClick={() => onItemClick('Subscribers')}>Subscribers page</div>
        <div className={`box ${activeItem === 'Settings' ? 'active' : ''}`} onClick={() => onItemClick('Settings')}>Settings page</div>
        </div>

        </div>
     );
}
 
export default AsideBar;
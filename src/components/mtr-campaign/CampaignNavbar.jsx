import starSoftwareLogo from '../../assets/star-software-logo.png';

// The campaign page's top bar: the redesigned site's navbar with only its
// logo, not linked, so visitors stay on the page. Only the campaign page
// uses it; the site's own Navbar is unchanged. Its styles come with the
// page (MtrCampaign.css).
export default function CampaignNavbar() {
  return (
    <header className="navbar-root">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-link">
            <img src={starSoftwareLogo} alt="Star Software" className="brand-logo-img" />
          </span>
        </div>
      </div>
    </header>
  );
}

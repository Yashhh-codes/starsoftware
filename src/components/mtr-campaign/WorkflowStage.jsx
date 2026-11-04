import HeroStage from '../mtr/HeroStage';

// The MTR landing page's hero animation, as a band under the campaign hero:
// a supplier MTR extracted, checked, reviewed and handed to the ERP. The
// component is the landing page's own; its styles are copied into
// MtrCampaign.css (the workflow stage block), so the landing page's
// stylesheet isn't needed here.
export default function WorkflowStage() {
  return (
    <section className="mc-stage">
      <div className="wrap">
        <div className="mt-hero-stage">
          <HeroStage />
        </div>
      </div>
    </section>
  );
}

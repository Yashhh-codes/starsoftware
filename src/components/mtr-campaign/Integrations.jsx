import Statement from './Statement';
import SystemsHub from './SystemsHub';
import { Icon } from './icons';

// The systems diagram, then one customer's before-and-after.
export default function Integrations({ integrations }) {
  const { proof } = integrations;
  return (
    <section className="sec sec-dark" id="integrations">
      <div className="wrap">
        <Statement text={integrations.heading} />
        <SystemsHub docs={integrations.docs} />
        <div className="ps">
          <p className="mx-k">{proof.kicker}</p>
          <p className="mx-big">
            <span className="mx-was">{proof.was}</span>
            <Icon name="right" />
            <span className="mx-now">{proof.now}</span>
          </p>
          <p className="mx-sub">{proof.sub}</p>
          <a className="link" href={proof.link[1]}>
            {proof.link[0]}
            <Icon name="arr" />
          </a>
        </div>
      </div>
    </section>
  );
}

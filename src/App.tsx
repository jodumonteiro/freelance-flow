

export default function PricingSection() {
  const handleSubscribe = (plan: 'starter' | 'growth') => {
    if (plan === 'starter') {
      window.location.href = 'https://freelanceeflow.gumroad.com/l/gtcoao';
    } else {
      window.location.href = 'https://freelanceeflow.gumroad.com/l/rawoa';
    }
  };

  return (
    <div style={{ backgroundColor: '#09090b', minHeight: '100vh', padding: '48px 16px', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: 'bold', letterSpacing: '-0.025em' }}>Simple, Transparent Pricing</h2>
          <p style={{ color: '#9ca3af', marginTop: '8px' }}>Choose the right plan to scale your global freelance operations.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          
          {/* Starter Plan */}
          <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#34d399', backgroundColor: '#064e3b', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #065f46' }}>
                Starter
              </span>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontSize: '36px', fontWeight: '800' }}>$49</span>
                <span style={{ marginLeft: '4px', fontSize: '18px', color: '#9ca3af' }}>/month</span>
              </div>
              <p style={{ marginTop: '16px', fontSize: '14px', color: '#9ca3af', lineHeight: '1.5' }}>
                Manage up to 5 active freelancers, basic time tracking, invoice submission, and standard tax compliance verification.
              </p>
            </div>
            <button
              onClick={() => handleSubscribe('starter')}
              style={{ marginTop: '32px', width: '100%', backgroundColor: '#27272a', color: '#fff', fontWeight: '500', padding: '12px 16px', borderRadius: '12px', border: '1px solid #3f3f46', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              Get Started with Starter
            </button>
          </div>

          {/* Growth Plan */}
          <div style={{ backgroundColor: '#18181b', border: '2px solid #10b981', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '32px', backgroundColor: '#10b981', color: '#000', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', padding: '2px 10px', borderRadius: '9999px' }}>
              Popular
            </div>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#34d399', backgroundColor: '#064e3b', padding: '4px 12px', borderRadius: '9999px', border: '1px solid #065f46' }}>
                Growth
              </span>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontSize: '36px', fontWeight: '800' }}>$199</span>
                <span style={{ marginLeft: '4px', fontSize: '18px', color: '#9ca3af' }}>/month</span>
              </div>
              <p style={{ marginTop: '16px', fontSize: '14px', color: '#9ca3af', lineHeight: '1.5' }}>
                Unlimited freelancers, automated escrow system, global multi-entity support, priority support, and advanced cash flow audit reports.
              </p>
            </div>
            <button
              onClick={() => handleSubscribe('growth')}
              style={{ marginTop: '32px', width: '100%', backgroundColor: '#10b981', color: '#000', fontWeight: 'bold', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
            >
              Upgrade to Growth
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
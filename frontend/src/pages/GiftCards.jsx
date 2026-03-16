const bulletIcon = (
  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold-100 text-gold-700 text-sm font-semibold">✓</span>
)

const GiftCards = () => {
  return (
    <div className="bg-gradient-to-b from-[#f6e8c6] to-[#fffaf3]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gift-pattern">
        <div className="absolute -top-10 -left-16 w-48 h-48 rounded-full bg-gold-200/30 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full bg-gold-300/25 blur-3xl" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.25em] text-[#7f1d4a]/80">Sudha Jewelry</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#7f1d4a] leading-tight">
              Gift Cards, Your Way
            </h1>
            <p className="text-lg text-gray-800 max-w-xl">
              The perfect gift, the premium way. Share the elegance of Sudha Jewelry with a personalized gift card,
              delivered instantly with your own message.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary">Send a Gift Card</button>
              <button className="btn-secondary">Learn More</button>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 text-sm text-gray-700">
              <span className="badge-gold">Instant delivery</span>
              <span className="badge-gold">Personal message</span>
              <span className="badge-gold">Flexible amounts</span>
            </div>
          </div>
          <div className="relative">
            <div className="card shadow-xl p-4 bg-white">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200"
                alt="Sudha Jewelry Gift Card"
                className="w-full rounded-2xl object-cover aspect-square"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Instant Delivery', desc: 'Digital gift card delivered in minutes.' },
            { title: 'Personalized Message', desc: 'Add your note for any occasion.' },
            { title: 'Flexible Amounts', desc: 'Choose the value that fits your gift.' },
            { title: 'Redeem Anywhere', desc: 'Use online or in-store with ease.' },
          ].map((item, idx) => (
            <div key={idx} className="card shadow-sm p-4 flex items-start gap-3">
              {bulletIcon}
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#7f1d4a]/80">How it works</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1f2937]">Three simple steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Choose', desc: 'Pick the amount and card design that feels right.' },
              { title: 'Personalize', desc: 'Add a heartfelt message for your recipient.' },
              { title: 'Send & Enjoy', desc: 'Deliver instantly via email; they redeem with ease.' },
            ].map((item, idx) => (
              <div key={idx} className="card p-6 shadow-sm text-left space-y-3">
                <div className="h-10 w-10 rounded-full bg-gold-100 text-gold-800 font-semibold flex items-center justify-center">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assurance band */}
      <section className="bg-premium-dark text-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            'BIS Hallmark Assurance',
            'Certified Quality',
            'Secure Checkout',
            'Priority Support',
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 rounded-2xl px-4 py-6 border border-white/10">
              <p className="font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-[#7f1d4a]/80">FAQ</p>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Gift card basics</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Does it expire?', a: 'No. Sudha Jewelry gift cards do not expire.' },
              { q: 'Where can it be used?', a: 'Redeem online on our store or at participating Sudha Jewelry boutiques.' },
              { q: 'Fees?', a: 'No activation or service fees.' },
              { q: 'Refunds?', a: 'Non-refundable once issued, but transferable to another recipient.' },
            ].map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
                <p className="font-semibold text-gray-900">{item.q}</p>
                <p className="text-sm text-gray-700 mt-1">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default GiftCards



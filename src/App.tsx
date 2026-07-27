import { useState, type FormEvent } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowDown, ArrowRight, BookOpenText, Sparkles } from 'lucide-react'
import { BrandMark } from './components/BrandMark'
import { FamilyEnvelope } from './components/FamilyEnvelope'
import { FavouriteCollection } from './components/FavouriteCollection'
import type { HouseFavourite } from './components/HouseFavouriteCard'
import { JournalNotesModal } from './components/JournalNotesModal'
import { MenuCatalog } from './components/MenuCatalog'
import { ToolNavigation } from './components/ToolNavigation'
import { useInPageNavigation } from './lib/sectionNavigation'

const archiveFeatures: HouseFavourite[] = [
  { entry: '014', name: 'Ube Crinkle Cookie', note: 'Soft-centred, gently sweet and finished with a deep violet crackle.', story: 'This cookie began with the feeling of ube sweets passed around a crowded family table: familiar, generous and best when shared.', heritage: 'Ube connects this entry to flavours loved across Southeast Asian homes while the crinkle-cookie form gives that memory a contemporary place in the pastry case.', tone: 'ube' },
  { entry: '019', name: 'Matcha Cheesecake', note: 'Earthy matcha balanced with sweetness and a creamy finish.', story: 'A study in restraint: enough matcha to keep its grassy bitterness present, held inside the comfort of a familiar cheesecake.', heritage: 'Tea appears here as an ingredient and creative influence. Its measured bitterness reflects the archive’s way of carrying Asian flavours into modern baking.', tone: 'matcha' },
  { entry: '023', name: 'Vietnamese Coffee Cookie', note: 'Dark-roasted coffee, condensed-milk sweetness and a soft centre.', story: 'Inspired by condensed-milk coffees enjoyed slowly around the family table, this entry preserves the contrast of dark roast and sweetness in cookie form.', heritage: 'The flavour recalls a familiar Vietnamese café rhythm without turning the bake into a literal drink: coffee, conversation and time shared together.', tone: 'coffee' },
  { entry: '028', name: 'Pecan Maple Banana Bread', note: 'Ripe banana, toasted pecan and maple warmth in a familiar loaf.', story: 'The kind of loaf that belongs on the kitchen counter: sliced for family, revisited through the day and remembered as much for the ritual as the flavour.', heritage: 'It sits in the archive as a between-cultures bake—North American pantry notes meeting the family-kitchen instinct to keep something comforting ready to share.', tone: 'maple' },
  { entry: '031', name: 'Mango Tart', note: 'Ripe mango over a crisp shell with a clean, fruit-led finish.', story: 'Cool mango and crisp pastry recall humid summers, market fruit and desserts brought to the table after a long meal.', heritage: 'Mango is allowed to remain the centre of the entry: a fruit associated with Southeast Asian markets and family tables, framed with modern pastry technique.', tone: 'mango' },
  { entry: '036', name: 'Black Forest Cake', note: 'Dark chocolate and cherry shaped into a familiar celebration cake.', story: 'Some favourites enter a family archive because they return at celebrations. This one is kept for its recognisable layers and the anticipation of the first slice.', heritage: 'The archive also holds adopted favourites. Its cultural story is the way families make room for cakes gathered from many places and turn them into their own rituals.', tone: 'chocolate' },
]

const newRecipes = [
  { entry: '042', name: 'Black Sesame Cheesecake', type: 'Cheesecakes' },
  { entry: '043', name: 'Mango Peach Cake', type: 'Cakes' },
  { entry: '044', name: 'Pecan Maple Bar', type: 'Crumbles & Bars' },
]

export default function App() {
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [inquiryError, setInquiryError] = useState('')
  const [journalIsOpen, setJournalIsOpen] = useState(false)
  useInPageNavigation()

  const handleInquirySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    setInquiryStatus('submitting')
    setInquiryError('')

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null) as { errors?: Array<{ message?: string }> } | null
        const formspreeMessage = result?.errors?.map((error) => error.message).filter(Boolean).join(' ')
        const fallbackMessage = response.status === 429
          ? 'Too many inquiries were sent at once. Please wait a moment and try again.'
          : 'We could not send your inquiry. Please try again.'

        setInquiryError(formspreeMessage || fallbackMessage)
        setInquiryStatus('error')
        return
      }

      form.reset()
      setInquiryStatus('success')
    } catch {
      setInquiryError('We could not connect to the inquiry service. Please check your connection and try again.')
      setInquiryStatus('error')
    }
  }

  const handleInquiryInvalid = () => {
    setInquiryError('Please complete the required name and email fields.')
    setInquiryStatus('error')
  }

  return (
    <>
      <ToolNavigation />
      <main>
        <section className="hero section-shell" id="home">
          <div className="hero__copy">
            <p className="eyebrow"><span /> Recipes collected. Stories preserved.</p>
            <h1><span>The Recipe</span><br /><em>Àrchive</em></h1>
            <p className="hero__tagline">Recipes collected. Stories preserved.</p>
            <p className="hero__lede">
              An evolving collection of pastries shaped by Vietnamese flavours, family memories and modern baking.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#collection">Explore the Collection <ArrowRight /></a>
              <a className="text-link" href="#our-story">Our Story <ArrowDown /></a>
            </div>
            <dl className="hero__details">
              <div><dt>Archive signature</dt><dd>Trà</dd></div>
              <div><dt>The collection</dt><dd>Flavour · memory · gia đình</dd></div>
            </dl>
          </div>

          <div className="hero__visual">
            <figure className="photo-card">
              <span className="photo-card__label">Archive study / 001</span>
              <img
                src={`${import.meta.env.BASE_URL}recipe-archive-hero.jpg`}
                srcSet={`${import.meta.env.BASE_URL}recipe-archive-hero-640.jpg 640w, ${import.meta.env.BASE_URL}recipe-archive-hero.jpg 1024w`}
                sizes="(max-width: 680px) calc(100vw - 46px), (max-width: 900px) 85vw, 46vw"
                alt="Ube crinkle cookie, matcha cheesecake and mango tart arranged on a deep green ceramic plate"
                width="1024"
                height="1536"
                fetchPriority="high"
              />
              <figcaption>Flavours held<br />for remembering.</figcaption>
            </figure>
            <div className="seal"><BrandMark decorative /></div>
          </div>
        </section>

        <section className="about section-shell section-block" id="our-story">
          <div className="about__statement">
            <p className="eyebrow"><span /> Our story</p>
            <h2>A Living Recipe<br /><em>Àrchive.</em></h2>
            <p className="display-copy">Flavours remembered, translated and given a place in the <em>present.</em></p>
          </div>
          <div className="about__columns">
            <p>Trà began as a way of preserving flavours that were rarely written down. Some came from family kitchens, some from Vietnamese cafés and bakeries, and others from the experience of growing up between cultures. The archive translates those memories into pastries made for the present.</p>
            <aside className="tra-note">
              <span className="archive-stamp">Bếp · Ký ức</span>
              <BrandMark className="tra-note__mark" decorative />
              <p>Trà means tea in Vietnamese—a nod to our Vietnamese roots and the tea-inspired flavours woven throughout our baking.</p>
              <small>Tea appears here as an ingredient and inspiration, never as a beverage product.</small>
            </aside>
          </div>
          <div className="about__people">
            <FamilyEnvelope />
            <div className="about__people-copy">
              <p className="eyebrow"><span /> Gia đình · family</p>
              <h3>Meet the family<br />&amp; bakers.</h3>
              <p>The Recipe Àrchive is shaped by family memory and the bakers who translate those flavours into pastries for the present.</p>
              <p>At the kitchen table, familiar motions pass from one pair of hands to another—shaping, filling and finishing pastries through the quiet rhythm of baking together.</p>
            </div>
          </div>
        </section>

        <section className="featured section-shell section-block" id="featured">
          <header className="section-heading">
            <p className="eyebrow"><span /> House favourites</p>
            <h2>Favourites from<br /><em>the Àrchive.</em></h2>
            <p>Six bakes we return to for their flavour, feeling and connection to the stories held by the archive.</p>
          </header>
          <FavouriteCollection products={archiveFeatures} />
        </section>

        <section className="new-recipes section-shell section-block" id="new-recipes">
          <header className="section-heading section-heading--row">
            <div><p className="eyebrow"><span /> Freshly catalogued</p><h2>New Recipes.</h2></div>
            <p>Newly developed recipes and recent additions, each leading into the complete bakery collection.</p>
          </header>
          <div className="entry-list">
            {newRecipes.map((item) => (
              <article key={item.entry}>
                <span>Recipe No. {item.entry}</span>
                <div><p>{item.type}</p><h3>{item.name}</h3></div>
                <a href="#collection" aria-label={`Find ${item.name} in the menu`}><ArrowRight /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="menu section-shell section-block" id="collection">
          <header className="section-heading">
            <p className="eyebrow"><span /> The complete index</p>
            <h2>The<br /><em>Collection.</em></h2>
            <p>Browse our evolving catalogue of cookies, cheesecakes, bars, banana breads, tarts and cakes.</p>
          </header>
          <MenuCatalog />
        </section>

        <section className="recipe section-block" id="journal">
          <div className="section-shell recipe__inner">
            <div className="recipe__card" aria-hidden="true">
              <span className="recipe__archive-letter">À</span>
              <i /><i /><i /><i />
              <span className="recipe__caption">Journal note / flavour & memory</span>
            </div>
            <div className="recipe__copy">
              <p className="eyebrow eyebrow--light"><span /> The Journal</p>
              <h2>Notes on flavour,<br />layers and <em>memory.</em></h2>
              <p>A place for ingredient studies, recipe reflections and the small details behind entries in The Recipe Àrchive.</p>
              <button className="button button--cream recipe__journal-button" type="button" onClick={() => setJournalIsOpen(true)}>
                Read the journal notes <BookOpenText />
              </button>
            </div>
          </div>
        </section>

        <section className="closing section-block">
          <div className="section-shell closing__inner">
            <Sparkles aria-hidden="true" />
            <p>Some recipes are written down.<br /><em>Others are remembered by taste.</em></p>
            <a className="button button--primary" href="#collection">Discover the Collection <ArrowRight /></a>
          </div>
        </section>

        <section className="contact section-block" id="visit-order">
          <div className="section-shell contact__inner">
            <p className="eyebrow eyebrow--light"><span /> Visit / Order</p>
            <h2>Begin an<br /><em>order inquiry.</em></h2>
            <p>Tell us what you’re looking for and include any details you already have in mind. Ordering and pickup information can be confirmed with your inquiry.</p>
            <div className="contact-services" aria-label="Order inquiry types">
              <article>
                <span>Celebration inquiry</span>
                <h3>Custom cakes</h3>
                <p>Start with the occasion, flavour direction and format you have in mind.</p>
                <a href="#order-inquiry-form">Use the inquiry form <ArrowDown /></a>
              </article>
              <article>
                <span>Collection inquiry</span>
                <h3>Pastries to share</h3>
                <p>Ask about cookies, bars, tarts, cheesecakes and cakes for your table.</p>
                <a href="#order-inquiry-form">Use the inquiry form <ArrowDown /></a>
              </article>
            </div>
            <form
              id="order-inquiry-form"
              className="inquiry-form"
              action="https://formspree.io/f/xpqvkdvv"
              method="POST"
              onSubmit={handleInquirySubmit}
              onInvalid={handleInquiryInvalid}
              onInput={() => {
                if (inquiryStatus === 'error') {
                  setInquiryStatus('idle')
                  setInquiryError('')
                }
              }}
              aria-busy={inquiryStatus === 'submitting'}
            >
              <div>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" autoComplete="name" required />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="inquiry-form__wide">
                <label htmlFor="inquiry-type">I’m interested in</label>
                <select id="inquiry-type" name="inquiryType" defaultValue="Custom Cake Order">
                  <option>Custom Cake Order</option>
                  <option>Collection Order Inquiry</option>
                  <option>General Product Inquiry</option>
                </select>
              </div>
              <div className="inquiry-form__wide">
                <label htmlFor="message">Order notes</label>
                <textarea id="message" name="message" rows={4} />
              </div>
              <button
                className="button button--cream inquiry-form__submit"
                type="submit"
                disabled={inquiryStatus === 'submitting'}
              >
                {inquiryStatus === 'submitting' ? 'Sending inquiry…' : 'Send inquiry'} <ArrowRight />
              </button>
              <p
                className={`inquiry-form__status inquiry-form__status--${inquiryStatus}`}
                role={inquiryStatus === 'error' ? 'alert' : 'status'}
                aria-live="polite"
              >
                {inquiryStatus === 'submitting' && 'Sending your inquiry…'}
                {inquiryStatus === 'error' && inquiryError}
                {inquiryStatus === 'success' && 'Thank you. Your inquiry has been sent to The Recipe Àrchive.'}
              </p>
            </form>
            <footer>
              <span>© 2026 The Recipe Àrchive</span>
              <span><BrandMark className="footer-mark" variant="reverse" decorative /> Mời bạn · come share the table.</span>
            </footer>
          </div>
        </section>
      </main>
      <AnimatePresence>
        {journalIsOpen && <JournalNotesModal onClose={() => setJournalIsOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

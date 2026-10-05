import { YouTube } from "@/components/youtube";
export function PageView() {
  return (
    <>
      <div className="field"><section className="section" style={{paddingTop: '56px'}}><div className="wrap" style={{maxWidth: '760px'}}><div className="talk-face"><img className="face" src="/images/talk-mug.webp" alt="Russ Laggan on stage" /><p className="label">Talk</p></div><h1>The Coffee Mug Test.</h1><p className="lede">Change how you see it, and you start to see everything differently.</p><YouTube id="5ep63Ti1QKE" title="The Coffee Mug Test: Are You Sabotaging Your Success?" /><p style={{marginTop: '10px', color: '#71717a', fontSize: '14px'}}>The Coffee Mug Test. 27 minutes, from his channel.</p><div className="lattice-card" style={{marginTop: '28px'}}><p>The Coffee Mug Test is a shift in how you see. Most people look at the same thing the same way. The talk moves the perspective, and the room starts to see the business differently.</p><p style={{marginTop: '14px'}}>Thirty minutes is the shift. Sixty minutes is the room practicing it on what they walked in with.</p></div><p style={{marginTop: '28px'}}><a className="btn" href="#contact" data-interest="Speaking">Contact Russ</a></p></div></section></div>
    </>
  );
}

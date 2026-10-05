import { YouTube } from "@/components/youtube";
export function PageView() {
  return (
    <>
      <div className="field"><section className="section" style={{paddingTop: '56px'}}><div className="wrap" style={{maxWidth: '760px'}}><div className="talk-face"><img className="face" src="/images/talk-jellyfish.webp" alt="Russ Laggan on stage" /><p className="label">Talk</p></div><h1>The Jellyfish Method.</h1><p className="lede">Put something valuable where people already are, and they run into it.</p><YouTube id="d1m5k_AEUMk" title="The Jellyfish Method for MASSIVE Growth" /><p style={{marginTop: '10px', color: '#71717a', fontSize: '14px'}}>The Jellyfish Method for Massive Growth. 30 minutes, from his channel.</p><div className="lattice-card" style={{marginTop: '28px'}}><p>A jellyfish does not hunt one person at a time. The tentacles are already out. People swim into them.</p><p style={{marginTop: '14px'}}>That is the talk. One listing can create hundreds of touches. A book of listings compounds, and the overlap keeps the number honest. Mortgage, title, and the people already in the market become part of the reach. The room leaves with a picture of their own tentacles, not a script to go chase with.</p><p style={{marginTop: '14px'}}>Thirty minutes is the model. Sixty minutes is the room building it on the business they walked in with.</p></div><p style={{marginTop: '28px'}}><a className="btn" href="#contact" data-interest="Speaking">Contact Russ</a></p></div></section></div>
    </>
  );
}

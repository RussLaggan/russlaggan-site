import { YouTube } from "@/components/youtube";
export function PageView() {
  return (
    <>
      <div className="field"><section className="section" style={{paddingTop: '56px'}}><div className="wrap" style={{maxWidth: '760px'}}><div className="talk-face"><img className="face" src="/images/talk-attraction.webp" alt="Russ Laggan on stage" /><p className="label">Talk</p></div><h1>The Attraction Advantage.</h1><p className="lede">The best recruiters don't recruit. They attract.</p><YouTube id="53t7nmtJNrc" title="The 3-Step Recipe to Recruit Agents (And Why It's NOT What You Think)" /><p style={{marginTop: '10px', color: '#71717a', fontSize: '14px'}}>His channel does not have a file titled The Attraction Advantage. This is the long one that teaches the shift: The 3-Step Recipe to Recruit Agents. 55 minutes.</p><div className="lattice-card" style={{marginTop: '28px'}}><p>Attraction comes out of the work already in motion. The people you want come to the person who is producing.</p><p style={{marginTop: '14px'}}>Thirty minutes is the argument. Sixty minutes gives the room time to apply it. For owners, sales leaders, and anyone whose job includes bringing people in.</p></div><p style={{marginTop: '28px'}}><a className="btn" href="#contact" data-interest="Speaking">Contact Russ</a></p></div></section></div>
    </>
  );
}
